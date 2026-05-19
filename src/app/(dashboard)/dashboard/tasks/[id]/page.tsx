import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Calendar, Flag, User, Briefcase, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import TaskDetailClient from "./TaskDetailClient";

const PRIORITY_LABEL: Record<string, string> = { HIGH: "عالية", MEDIUM: "متوسطة", LOW: "منخفضة" };
const PRIORITY_COLOR: Record<string, string> = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
const STATUS_LABEL: Record<string, string> = {
  TODO: "جديدة", IN_PROGRESS: "قيد التنفيذ", REVIEW: "قيد المراجعة",
  DONE: "مكتملة", COMPLETED: "مكتملة",
};
const STATUS_COLOR: Record<string, string> = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  REVIEW: "bg-amber-50 text-amber-700",
  DONE: "bg-emerald-50 text-emerald-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
};

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, role: true } },
      createdBy:  { select: { id: true, name: true, role: true } },
      case:       { select: { id: true, title: true, caseNumber: true } },
      subTasks: {
        include: { assignedTo: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
      taskComments: {
        include: { user: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!task) notFound();

  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  });

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE" && task.status !== "COMPLETED";
  const completedSubTasks = task.subTasks.filter(s => s.status === "DONE" || s.status === "COMPLETED").length;
  const totalSubTasks = task.subTasks.length;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/tasks" className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowRight className="w-4 h-4" />
          <span>المهام</span>
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-300 font-semibold truncate max-w-xs">{task.title}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${PRIORITY_COLOR[task.priority] || ""}`}>
                {PRIORITY_LABEL[task.priority] || task.priority}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[task.status] || "bg-slate-100 text-slate-700"}`}>
                {STATUS_LABEL[task.status] || task.status}
              </span>
              {task.approvalStatus === "PENDING_APPROVAL" && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  ⏳ بانتظار الموافقة
                </span>
              )}
            </div>
            <h1 className="text-xl font-extrabold text-slate-800">{task.title}</h1>
            {task.description && (
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{task.description}</p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">المسند إليه</p>
              <p className="font-semibold text-slate-700">{task.assignedTo.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">أنشأها</p>
              <p className="font-semibold text-slate-700">{task.createdBy.name}</p>
            </div>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className={`w-4 h-4 ${isOverdue ? "text-red-500" : "text-slate-400"}`} />
              <div>
                <p className="text-xs text-slate-400">الموعد النهائي</p>
                <p className={`font-semibold ${isOverdue ? "text-red-600" : "text-slate-700"}`}>
                  {formatDate(task.dueDate)}{isOverdue ? " ⚠️ متأخرة" : ""}
                </p>
              </div>
            </div>
          )}
          {task.case && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">القضية</p>
                <Link href={`/dashboard/cases/${task.case.id}`} className="font-semibold text-blue-600 hover:underline">
                  {task.case.title}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sub-task progress */}
        {totalSubTasks > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-600">المهام الفرعية ({completedSubTasks}/{totalSubTasks})</span>
              <span className="text-xs text-slate-400">{Math.round((completedSubTasks / totalSubTasks) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(completedSubTasks / totalSubTasks) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Interactive section (client) */}
      <TaskDetailClient
        task={{
          id: task.id,
          status: task.status,
          subTasks: task.subTasks.map(s => ({
            id: s.id,
            title: s.title,
            status: s.status,
            dueDate: s.dueDate?.toISOString() ?? null,
            assignedTo: s.assignedTo,
          })),
          taskComments: task.taskComments.map(c => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
            user: c.user,
          })),
        }}
        users={users}
        currentUserId={session.id}
      />
    </div>
  );
}
