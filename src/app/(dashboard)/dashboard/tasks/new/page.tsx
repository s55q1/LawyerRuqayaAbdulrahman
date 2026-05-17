import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewTaskForm from "@/components/dashboard/NewTaskForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function NewTaskPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  // جلب كافة أعضاء الكادر النشطين لإسناد المهام لهم
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });

  // جلب القضايا الجارية لتسهيل ربط المهام بها اختيارياً
  const cases = await prisma.case.findMany({
    select: {
      id: true,
      title: true,
      caseNumber: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>العمليات الإدارية</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy-200)" }}>إسناد وتكليف عمل جديد</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>تمكين تبادل المهام والتكليفات الرسمية بين أعضاء كادر المكتب</p>
        </div>
        <Link href="/dashboard/tasks">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors">
            <ArrowRight className="w-4 h-4 ml-1" />
            <span className="font-bold text-sm">العودة للمهام</span>
          </button>
        </Link>
      </div>

      {/* ── FORM COMPONENT ── */}
      <NewTaskForm users={users} cases={cases} />
    </div>
  );
}
