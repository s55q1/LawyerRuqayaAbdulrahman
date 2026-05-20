"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";

interface Case { id: string; title: string; caseNumber: string; }

export default function FinanceClient({ cases }: { cases: Case[] }) {
  const router = useRouter();
  const [showExpense, setShowExpense] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ caseId: "", description: "", amount: "", notes: "" });

  async function handleAddExpense() {
    if (!form.caseId || !form.description || !form.amount) return;
    setLoading(true);
    try {
      const res = await fetch("/api/finance/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
      });
      if (res.ok) {
        setShowExpense(false);
        setForm({ caseId: "", description: "", amount: "", notes: "" });
        router.refresh();
      }
    } finally { setLoading(false); }
  }

  return (
    <>
      <button
        onClick={() => setShowExpense(true)}
        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
        style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
      >
        <Plus className="w-3.5 h-3.5" /> إضافة مصروف
      </button>

      {showExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>إضافة مصروف جديد</h2>
              <button onClick={() => setShowExpense(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3" dir="rtl">
              <select
                value={form.caseId}
                onChange={e => setForm(f => ({ ...f, caseId: e.target.value }))}
                className="w-full text-sm rounded-xl border px-3 py-2.5 outline-none focus:border-[#C5A059] text-right"
                style={{ background: "#0B1325", borderColor: "rgba(255,255,255,0.1)", color: "#F1F5F9", fontFamily: "'Cairo', sans-serif" }}
              >
                <option value="">اختر القضية *</option>
                {cases.map(c => <option key={c.id} value={c.id}>{c.title} ({c.caseNumber})</option>)}
              </select>

              <input
                placeholder="وصف المصروف *"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full text-sm rounded-xl border px-3 py-2.5 outline-none focus:border-[#C5A059] text-right"
                style={{ background: "#0B1325", borderColor: "rgba(255,255,255,0.1)", color: "#F1F5F9", fontFamily: "'Cairo', sans-serif" }}
              />

              <input
                type="number"
                placeholder="المبلغ بالريال *"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full text-sm rounded-xl border px-3 py-2.5 outline-none focus:border-[#C5A059] text-right"
                style={{ background: "#0B1325", borderColor: "rgba(255,255,255,0.1)", color: "#F1F5F9", fontFamily: "'Cairo', sans-serif" }}
              />

              <textarea
                placeholder="ملاحظات (اختياري)"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full text-sm rounded-xl border px-3 py-2.5 outline-none focus:border-[#C5A059] text-right resize-none"
                style={{ background: "#0B1325", borderColor: "rgba(255,255,255,0.1)", color: "#F1F5F9", fontFamily: "'Cairo', sans-serif" }}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddExpense}
                disabled={loading || !form.caseId || !form.description || !form.amount}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #C5A059, #E6B980)", color: "#0B1325", fontFamily: "'Cairo', sans-serif" }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ المصروف"}
              </button>
              <button
                onClick={() => setShowExpense(false)}
                className="px-5 py-2.5 rounded-xl text-sm border transition-colors"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "#6B82A0", fontFamily: "'Cairo', sans-serif" }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
