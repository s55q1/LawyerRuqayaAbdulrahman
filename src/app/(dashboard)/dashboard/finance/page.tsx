"use client";
import React, { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  ArrowUpRight, 
  FileText, 
  CreditCard, 
  ShoppingBag, 
  PieChart,
  ArrowUp,
  ArrowDown,
  Wallet,
  Landmark,
  Receipt,
  Users
} from "lucide-react";
import Link from "next/link";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data for Contracts
  const contracts = [
    { id: "1", contractNumber: "CNT-2026-001", client: "شركة الأمل للمقاولات", amount: 50000, paid: 30000, status: "PARTIAL", date: "2026-05-01" },
    { id: "2", contractNumber: "CNT-2026-002", client: "خالد بن محمد الرويس", amount: 15000, paid: 15000, status: "PAID", date: "2026-04-15" },
    { id: "3", contractNumber: "CNT-2026-003", client: "مؤسسة النجاح التجارية", amount: 30000, paid: 0, status: "PENDING", date: "2026-05-10" },
    { id: "4", contractNumber: "CNT-2026-004", client: "الشركة العربية للاستثمار", amount: 80000, paid: 80000, status: "PAID", date: "2026-05-12" },
  ];

  // Mock Data for Salaries
  const salaries = [
    { id: "1", employee: "أحمد منصور (محامي شريك)", amount: 12000, status: "PAID", month: "مايو 2026" },
    { id: "2", employee: "سارة العتيبي (أخصائية محاسبة)", amount: 9000, status: "PAID", month: "مايو 2026" },
    { id: "3", employee: "محمد الشمري (محامي متدرب)", amount: 4000, status: "PENDING", month: "مايو 2026" },
  ];

  // Mock Data for Purchases
  const purchases = [
    { id: "1", item: "أثاث مكتبي فاخر (طاولات اجتماعات)", amount: 15000, date: "2026-05-02", category: "أصول ثابتة" },
    { id: "2", item: "مستلزمات مكتبية وقرطاسية دورية", amount: 1200, date: "2026-05-05", category: "تشغيلية" },
    { id: "3", item: "اشتراك نظام إدارة القضايا السحابي", amount: 3000, date: "2026-05-01", category: "تقنية" },
  ];

  // Monthly stats for chart
  const monthlyStats = [
    { month: "يناير", revenue: 45000, expenses: 18000 },
    { month: "فبراير", revenue: 52000, expenses: 22000 },
    { month: "مارس", revenue: 68000, expenses: 21000 },
    { month: "أبريل", revenue: 58000, expenses: 25000 },
    { month: "مايو", revenue: 95000, expenses: 31000 },
  ];

  const totalRevenue = contracts.reduce((s, c) => s + c.amount, 0);
  const totalCollected = contracts.reduce((s, c) => s + c.paid, 0);
  const totalSalaries = salaries.reduce((s, c) => s + c.amount, 0);
  const totalPurchases = purchases.reduce((s, c) => s + c.amount, 0);
  const totalExpenses = totalSalaries + totalPurchases;
  const netProfit = totalCollected - totalExpenses;

  return (
    <div className="space-y-8 animate-fade-in text-right" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>الإدارة المالية</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">داشبورد الحسابات والمالية</h1>
          <p className="text-sm mt-1 text-slate-400">متابعة الأداء المالي، التدفقات النقدية، المصروفات، والأرباح التشغيلية للمكتب</p>
        </div>
        <button className="btn-gold flex items-center gap-2 self-start md:self-auto transform hover:scale-105 transition-all duration-300 shadow-gold">
          <Plus className="w-4 h-4" />
          <span className="font-bold text-sm">عملية مالية جديدة</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 overflow-x-auto">
        {[
          { id: "overview", label: "نظرة عامة (الداشبورد)", icon: <PieChart className="w-4 h-4" /> },
          { id: "contracts", label: "العقود والمدفوعات", icon: <FileText className="w-4 h-4" /> },
          { id: "salaries", label: "الرواتب الشهرية", icon: <CreditCard className="w-4 h-4" /> },
          { id: "purchases", label: "مشتريات المكتب", icon: <ShoppingBag className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors font-bold text-sm ${
              activeTab === tab.id
                ? "border-[#C5A059] text-[#C5A059]"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: OVERVIEW (DASHBOARD) ─── */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Revenue */}
            <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl p-6 border border-slate-800 relative overflow-hidden group hover:border-[#C5A059]/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A059]/5 rounded-bl-full z-0 transition-all group-hover:scale-110" />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#C5A059]/10 text-[#C5A059]">
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-400">القيمة الإجمالية للعقود</span>
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-white">{formatCurrency(totalRevenue)}</div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2 font-bold">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>+12.4% الشهر الماضي</span>
                </div>
              </div>
            </div>

            {/* Card 2: Collected */}
            <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl p-6 border border-slate-800 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full z-0 transition-all group-hover:scale-110" />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-400">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-400">المحصل الفعلي</span>
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-emerald-400">{formatCurrency(totalCollected)}</div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2 font-bold">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>+8.2% تحصيل فوري</span>
                </div>
              </div>
            </div>

            {/* Card 3: Expenses */}
            <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl p-6 border border-slate-800 relative overflow-hidden group hover:border-rose-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full z-0 transition-all group-hover:scale-110" />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-400">المصروفات والتشغيل</span>
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-rose-400">{formatCurrency(totalExpenses)}</div>
                <div className="flex items-center gap-1 text-rose-400 text-xs mt-2 font-bold">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>+5.1% رواتب وتشغيل</span>
                </div>
              </div>
            </div>

            {/* Card 4: Profit Margin */}
            <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl p-6 border border-slate-800 relative overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full z-0 transition-all group-hover:scale-110" />
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-400">صافي الربح الفعلي</span>
              </div>
              <div className="relative z-10">
                <div className="text-2xl font-black text-blue-400">{formatCurrency(netProfit)}</div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2 font-bold">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>72.4% هامش صافي الربح</span>
                </div>
              </div>
            </div>

          </div>

          {/* Charts & Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart Card: Monthly Performance */}
            <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl p-6 border border-slate-800 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">مقارنة الإيرادات بالمصروفات</h3>
                  <p className="text-xs text-slate-400">التحليل المالي للأشهر الخمسة الماضية</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>الإيرادات</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#C5A059]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
                    <span>المصروفات</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Built with Elegant CSS */}
              <div className="h-64 flex items-end justify-between gap-4 pt-4 border-b border-slate-800/80 px-2">
                {monthlyStats.map((stat, sIdx) => {
                  const maxVal = Math.max(...monthlyStats.map(s => Math.max(s.revenue, s.expenses)));
                  const revHeight = Math.round((stat.revenue / maxVal) * 100);
                  const expHeight = Math.round((stat.expenses / maxVal) * 100);

                  return (
                    <div key={sIdx} className="flex-1 flex flex-col items-center gap-2 group/bar">
                      <div className="w-full flex items-end justify-center gap-2 h-48 relative">
                        {/* Expense Bar */}
                        <div 
                          className="w-3.5 bg-[#C5A059] rounded-t-full transition-all duration-500 relative group-hover/bar:brightness-110" 
                          style={{ height: `${expHeight}%` }}
                        >
                          {/* Tooltip */}
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0B1325] border border-slate-800 text-[#C5A059] text-[10px] font-bold py-1 px-2 rounded opacity-0 pointer-events-none group-hover/bar:opacity-100 transition-opacity z-30 whitespace-nowrap">
                            م: {formatCurrency(stat.expenses)}
                          </span>
                        </div>
                        {/* Revenue Bar */}
                        <div 
                          className="w-3.5 bg-emerald-500 rounded-t-full transition-all duration-500 relative group-hover/bar:brightness-110" 
                          style={{ height: `${revHeight}%` }}
                        >
                          {/* Tooltip */}
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0B1325] border border-slate-800 text-emerald-400 text-[10px] font-bold py-1 px-2 rounded opacity-0 pointer-events-none group-hover/bar:opacity-100 transition-opacity z-30 whitespace-nowrap">
                            إ: {formatCurrency(stat.revenue)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold">{stat.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expense Distribution Ring / Progress Trackers */}
            <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-2">توزيع المصروفات التشغيلية</h3>
              <p className="text-xs text-slate-400 mb-6">مراقبة بنود الإنفاق وهيكلها النسبي</p>
              
              <div className="space-y-6">
                
                {/* salaries progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">الرواتب والأجور الشهرية</span>
                    <span className="text-slate-400">{formatCurrency(totalSalaries)} ({Math.round((totalSalaries / totalExpenses) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#C5A059] h-full rounded-full" style={{ width: `${Math.round((totalSalaries / totalExpenses) * 100)}%` }} />
                  </div>
                </div>

                {/* office equipment progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">أصول ومشتريات ثابتة (أثاث)</span>
                    <span className="text-slate-400">{formatCurrency(15000)} ({Math.round((15000 / totalExpenses) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.round((15000 / totalExpenses) * 100)}%` }} />
                  </div>
                </div>

                {/* technical progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">الخدمات السحابية والأنظمة التقنية</span>
                    <span className="text-slate-400">{formatCurrency(3000)} ({Math.round((3000 / totalExpenses) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.round((3000 / totalExpenses) * 100)}%` }} />
                  </div>
                </div>

                {/* operational progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">قرطاسية ونثريات تشغيلية</span>
                    <span className="text-slate-400">{formatCurrency(1200)} ({Math.round((1200 / totalExpenses) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.round((1200 / totalExpenses) * 100)}%` }} />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Quick Actions and Recents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Contracts & Invoices */}
            <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl p-6 border border-slate-800 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">آخر العقود المالية والمتحصلات</h3>
                <button onClick={() => setActiveTab("contracts")} className="text-xs text-[#C5A059] font-bold hover:underline">عرض الكل</button>
              </div>

              <div className="space-y-3">
                {contracts.map(cnt => (
                  <div key={cnt.id} className="flex items-center justify-between p-4 bg-[#0a0f1d] hover:bg-slate-900 rounded-xl border border-slate-800/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-slate-300">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{cnt.client}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{cnt.contractNumber} • {cnt.date}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{formatCurrency(cnt.amount)}</div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                        cnt.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" :
                        cnt.status === "PARTIAL" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {cnt.status === "PAID" ? "مكتمل السداد" : cnt.status === "PARTIAL" ? "سداد جزئي" : "معلق"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Health / Notifications Card */}
            <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-6">إجراءات وقائية ومؤشرات</h3>
              <div className="space-y-4">
                
                {/* Alert 1 */}
                <div className="flex gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400">هامش الأرباح آمن ومستقر</h4>
                    <p className="text-[10px] text-slate-400 mt-1">نسبة المصروفات لا تتجاوز 25٪ من التدفق النقدي المحصل هذا الشهر، وهو مؤشر تشغيلي ممتاز.</p>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="flex gap-3 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-400">تنبيه تحصيل: عقد مؤسسة النجاح</h4>
                    <p className="text-[10px] text-slate-400 mt-1">تجاوز العقد PENDING تاريخ الاستحقاق المتوقع. ينصح بإصدار إشعار تذكير للدفع قريباً.</p>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="flex gap-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-400">مسيرات مايو معتمدة بالكامل</h4>
                    <p className="text-[10px] text-slate-400 mt-1">تم توثيق مسيرات الرواتب لشهر مايو واعتماد الحسابات التشغيلية بنجاح.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* ─── TAB: CONTRACTS ─── */}
      {activeTab === "contracts" && (
        <div className="space-y-6">
          {/* Table */}
          <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-900" style={{ borderBottom: "1px solid var(--navy-900)" }}>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">رقم العقد</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">العميل</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">القيمة الكلية</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">المحصل الفعلي</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">الحالة</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-white">{contract.contractNumber}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-300">{contract.client}</td>
                    <td className="px-6 py-4 text-sm font-bold text-white">{formatCurrency(contract.amount)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-400">{formatCurrency(contract.paid)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        contract.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" :
                        contract.status === "PARTIAL" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {contract.status === "PAID" ? "مكتمل" : contract.status === "PARTIAL" ? "جزئي" : "معلق"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{contract.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB: SALARIES ─── */}
      {activeTab === "salaries" && (
        <div className="space-y-6">
          <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="text-xl font-bold p-6 text-white border-b border-slate-800">مسيرات الرواتب الشهرية للموظفين</div>
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-900">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">الموظف الكادر</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">المبلغ المستحق</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">الشهر المستهدف</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">حالة الصرف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {salaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-white">{salary.employee}</td>
                    <td className="px-6 py-4 text-sm font-bold text-white">{formatCurrency(salary.amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{salary.month}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        salary.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {salary.status === "PAID" ? "تم الصرف" : "معلق"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB: PURCHASES ─── */}
      {activeTab === "purchases" && (
        <div className="space-y-6">
          <div className="bg-[#0f172a]/80 backdrop-blur rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="text-xl font-bold p-6 text-white border-b border-slate-800">مشتريات ومصروفات المكتب العامة</div>
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-900">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">البند / المشتريات</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">مبلغ العملية</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">التصنيف المحاسبي</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400">تاريخ القيد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-white">{purchase.item}</td>
                    <td className="px-6 py-4 text-sm font-bold text-white">{formatCurrency(purchase.amount)}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{purchase.category}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{purchase.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
