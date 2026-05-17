import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import Link from "next/link";
import TasksRegistry from "@/components/dashboard/TasksRegistry";

export default async function TasksPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // جلب كافة المهام القانونية والإدارية من قاعدة البيانات وربط الموكلين والأعضاء المسندة إليهم
  const tasks = await prisma.task.findMany({
    include: {
      assignedTo: true,
      createdBy: true,
      case: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      
      {/* ── HEADER SECTION ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>العمليات الإدارية</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy-200)" }}>إدارة المهام والعمليات التشاركية</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>إسناد المهام بين الكادر القانوني والمحاسبي وتتبع الخط الزمني للإنجاز</p>
        </div>
        <Link href="/dashboard/tasks/new">
          <button className="btn-gold flex items-center gap-2 self-start md:self-auto transform hover:scale-[1.03] transition-all duration-300 shadow-gold">
            <Plus className="w-4 h-4" />
            <span className="font-bold text-sm">إسناد مهمة جديدة</span>
          </button>
        </Link>
      </div>

      {/* ── INTERACTIVE TASKS REGISTRY ── */}
      <TasksRegistry initialTasks={tasks} />

    </div>
  );
}
