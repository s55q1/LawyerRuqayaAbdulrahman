"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("غير مصرح لك بالقيام بهذا الإجراء");
  }

  const userRole = session.role;

  // جلب المهمة للتأكد من وجودها ومعرفة صاحبها
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { assignedTo: true },
  });

  if (!task) {
    throw new Error("المهمة غير موجودة");
  }

  // تطبيق قاعدة العمل: لا يمكن للمتدرب إغلاق المهام
  // إذا حاول المتدرب إغلاق المهمة، تتحول تلقائياً إلى "قيد المراجعة" (REVIEW)
  if (userRole === "TRAINEE" && (newStatus === "DONE" || newStatus === "COMPLETED")) {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "REVIEW" },
    });
    
    // إنشاء سجل نشاط (ActivityLog) إذا كان الموديل موجوداً
    try {
      await prisma.activityLog.create({
        data: {
          userId: session.id,
          action: "UPDATE_STATUS_TO_REVIEW",
          entity: "TASK",
          entityId: taskId,
          changes: JSON.stringify({ from: task.status, to: "REVIEW", reason: "Trainee attempted to close task" }),
        },
      });
    } catch (e) {
      // تجاهل الخطأ إذا لم يكن الموديل مهيأً بالكامل
    }

    revalidatePath("/dashboard/tasks");
    return { success: true, message: "تم إرسال المهمة للمراجعة من قبل المحامي (لا يحق للمتدرب إغلاق المهام مباشرة)" };
  }

  // تحديث الحالة بشكل طبيعي لباقي الأدوار
  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  // إنشاء سجل نشاط
  try {
    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: "UPDATE_STATUS",
        entity: "TASK",
        entityId: taskId,
        changes: JSON.stringify({ from: task.status, to: newStatus }),
      },
    });
  } catch (e) {
    // تجاهل
  }

  revalidatePath("/dashboard/tasks");
  return { success: true, message: "تم تحديث حالة المهمة بنجاح" };
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  assignedToId: string;
  caseId?: string;
  attachments?: string[];
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("غير مصرح لك بالقيام بهذا الإجراء");
  }

  if (!data.title) {
    throw new Error("عنوان المهمة مطلوب");
  }
  if (!data.assignedToId) {
    throw new Error("يجب اختيار العضو المسند إليه المهمة");
  }

  const createdTask = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || "",
      priority: data.priority || "MEDIUM",
      status: data.status || "TODO",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assignedToId: data.assignedToId,
      createdById: session.id,
      caseId: data.caseId || null,
      attachments: data.attachments?.length ? JSON.stringify(data.attachments) : null,
    },
  });

  // إنشاء إشعار فوري للشخص المسند إليه
  try {
    await prisma.notification.create({
      data: {
        userId: data.assignedToId,
        title: "مهمة جديدة مسندة إليك",
        message: `تم إسناد مهمة جديدة لك: "${data.title}" من قبل ${session.name}`,
        type: "TASK",
        actionUrl: `/dashboard/tasks`,
      },
    });
  } catch (e) {
    // تجاهل الفشل في إنشاء الإشعار
  }

  revalidatePath("/dashboard/tasks");
  return { success: true, task: createdTask };
}
