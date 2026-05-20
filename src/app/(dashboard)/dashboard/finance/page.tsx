import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, FileText, Receipt, AlertCircle } from "lucide-react";
import Link from "next/link";
import FinanceClient from "./FinanceClient";

export const dynamic = "force-dynamic";

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY", "LAWYER")) redirect("/dashboard");

  const params  = await searchParams;
  const scope   = params.scope || "all";
  const isMine  = scope === "mine";
  const isAdmin = hasRole(session, "MANAGER", "LEGAL_SECRETARY");

  const [contracts, expenses, cases] = await Promise.all([
    prisma.contract.findMany({
      where: isMine ? { case: { lawyerId: session!.id } } : {},
      include: {
        client: { select: { id: true, name: true } },
        case:   { select: { id: true, title: true, caseNumber: true } },
        receipts: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.caseExpense.findMany({
      where: isMine ? { case: { lawyerId: session!.id } } : {},
      include: { case: { select: { id: true, title: true, caseNumber: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.case.findMany({
      where: isMine ? { lawyerId: session!.id } : {},
      select: { id: true, title: true, caseNumber: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalRevenue   = contracts.reduce((s, c) => s + c.totalAmount, 0);
  const totalCollected = contracts.reduce((s, c) => s + c.paidAmount, 0);
  const totalExpenses  = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit      = totalCollected - totalExpenses;
  const pendingAmount  = totalRevenue - totalCollected;

  const stats = [
    { label: "إجمالي العقود",     value: formatCurrency(totalRevenue),   icon: <FileText  className="w-5 h-5"/>, color: "#C5A059",  bg: "rgba(197,160,89,0.1)" },
    { label: "المبالغ المحصّلة",  value: formatCurrency(totalCollected), icon: <Wallet    className="w-5 h-5"/>, color: "#10B981",  bg: "rgba(16,185,129,0.1)" },
    { label: "المبالغ المعلقة",   value: formatCurrency(pendingAmount),  icon: <AlertCircle className="w-5 h-5"/>, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
    { label: "صافي الأرباح",      value: formatCurrency(netProfit),      icon: netProfit >= 0 ? <TrendingUp className="w-5 h-5"/> : <TrendingDown className="w-5 h-5"/>, color: netProfit >= 0 ? "#10B981" : "#EF4444", bg: netProfit >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)" },
  ];

  const STATUS_LABEL: Record<string, string> = { PENDING: "معلق", PARTIAL: "جزئي", PAID: "مدفوع", OVERDUE: "متأخر" };
  const STATUS_COLOR: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    PARTIAL: "bg-blue-50 text-blue-700 border-blue-200",
    PAID:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    OVERDUE: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#C5A059" }}>الإدارة المالية</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#F8FAFC" }}>الحسابات والمالية</h1>
          <p className="text-sm mt-1" style={{ color: "#4A6080" }}>متابعة العقود والمدفوعات والمصروفات</p>
        </div>
        {isAdmin && <Link href="/dashboard/finance/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #C5A059, #E6B980)", color: "#0B1325" }}>
          <Plus className="w-4 h-4" />
          عقد جديد
        </Link>}
      </div>

      {/* Scope Tabs */}
      <div className="flex gap-2">
        <Link href="/dashboard/finance"
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!isMine ? "text-[#0B1325] shadow-sm" : "border text-[#4A6080] hover:border-[#C5A059]"}`}
          style={!isMine ? { background: "linear-gradient(135deg,#C5A059,#E6B980)", borderColor: "transparent" } : { borderColor: "rgba(255,255,255,0.1)" }}>
          حسابات المكتب
        </Link>
        <Link href="/dashboard/finance?scope=mine"
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isMine ? "text-[#0B1325] shadow-sm" : "border text-[#4A6080] hover:border-[#C5A059]"}`}
          style={isMine ? { background: "linear-gradient(135deg,#C5A059,#E6B980)", borderColor: "transparent" } : { borderColor: "rgba(255,255,255,0.1)" }}>
          حساباتي
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl p-5 border" style={{ background: "#111A2E", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <div className="text-xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-semibold mt-1" style={{ color: "#4A6080" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Contracts Table */}
      <div className="rounded-2xl overflow-hidden border" style={{ background: "#111A2E", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="font-bold text-base" style={{ color: "#F1F5F9" }}>العقود والمدفوعات</h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(197,160,89,0.1)", color: "#C5A059" }}>
            {contracts.length} عقد
          </span>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
            <p style={{ color: "rgba(255,255,255,0.2)" }}>لا توجد عقود بعد</p>
            <Link href="/dashboard/finance/new" className="mt-3 inline-block text-sm font-bold" style={{ color: "#C5A059" }}>
              + إضافة عقد
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["رقم العقد", "العميل", "القضية", "الإجمالي", "المحصّل", "الحالة", "إجراء"].map((h, i) => (
                    <th key={i} className="px-5 py-3.5 text-xs font-bold" style={{ color: "#4A6080" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contracts.map(c => {
                  const progress = c.totalAmount > 0 ? Math.round((c.paidAmount / c.totalAmount) * 100) : 0;
                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 font-mono text-xs" style={{ color: "#C5A059" }}>{c.contractNumber}</td>
                      <td className="px-5 py-4 font-bold" style={{ color: "#F1F5F9" }}>{c.client.name}</td>
                      <td className="px-5 py-4 text-xs" style={{ color: "#6B82A0" }}>
                        {c.case ? `${c.case.title} (${c.case.caseNumber})` : "—"}
                      </td>
                      <td className="px-5 py-4 font-bold" style={{ color: "#F1F5F9" }}>{formatCurrency(c.totalAmount)}</td>
                      <td className="px-5 py-4">
                        <div>
                          <span className="font-bold text-emerald-400">{formatCurrency(c.paidAmount)}</span>
                          <div className="w-20 h-1.5 bg-white/10 rounded-full mt-1">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_COLOR[c.paymentStatus] || ""}`}>
                          {STATUS_LABEL[c.paymentStatus] || c.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/dashboard/finance/${c.id}`}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background: "rgba(197,160,89,0.1)", color: "#C5A059" }}>
                          تفاصيل
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl overflow-hidden border" style={{ background: "#111A2E", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="font-bold text-base" style={{ color: "#F1F5F9" }}>مصروفات القضايا</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
              {formatCurrency(totalExpenses)}
            </span>
            <FinanceClient cases={cases} />
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
            <p style={{ color: "rgba(255,255,255,0.2)" }}>لا توجد مصروفات مسجّلة</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["الوصف", "القضية", "المبلغ", "التاريخ"].map((h, i) => (
                    <th key={i} className="px-5 py-3.5 text-xs font-bold" style={{ color: "#4A6080" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-semibold" style={{ color: "#F1F5F9" }}>{e.description}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "#6B82A0" }}>
                      {e.case ? `${e.case.title} (${e.case.caseNumber})` : "—"}
                    </td>
                    <td className="px-5 py-4 font-bold text-red-400">{formatCurrency(e.amount)}</td>
                    <td className="px-5 py-4 text-xs" style={{ color: "#6B82A0" }}>{formatDate(e.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
