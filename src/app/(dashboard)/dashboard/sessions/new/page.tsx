import React from "react";
import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NewGeneralSessionForm from "./NewGeneralSessionForm";
import { CalendarDays } from "lucide-react";

export default async function NewGeneralSessionPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  // Security: only MANAGER, LEGAL_SECRETARY and LAWYER can access/add sessions
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY", "LAWYER")) {
    redirect("/dashboard");
  }

  // Lawyers see only their assigned cases. Managers and Legal Secretaries see all active cases.
  const cases = await prisma.case.findMany({
    where: {
      ...(session.role === "LAWYER" ? { lawyerId: session.id } : {}),
      status: "ACTIVE", // Only allow recording sessions for active cases
    },
    select: {
      id: true,
      title: true,
      caseNumber: true,
      client: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-1.5 text-right">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gold-600)" }}>
          المرافعات والجدولة
        </p>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 self-start">
          <CalendarDays className="w-8 h-8 text-[#C5A059] flex-shrink-0" />
          <span>جدولة جلسة جديدة</span>
        </h1>
        <p className="text-sm text-slate-400">
          سجل تفاصيل الجلسة القادمة للمحكمة واربطها بملف القضية مباشرةً
        </p>
      </div>

      {/* Form Card */}
      <div
        className="rounded-2xl p-8 shadow-2xl"
        style={{
          background: "#111A2E",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <NewGeneralSessionForm cases={cases} />
      </div>
    </div>
  );
}
