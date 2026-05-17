"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddExpenseForm({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ description: "", amount: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/finance/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, caseId, amount: parseFloat(form.amount) }),
      });
      setForm({ description: "", amount: "", notes: "" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 w-full";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2">
      <input type="text" required placeholder="وصف المصروف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} col-span-2`} />
      <input type="number" required min="1" placeholder="المبلغ" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputClass} />
      <button type="submit" disabled={loading} className="col-span-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-70">
        {loading ? "..." : "+ تسجيل مصروف"}
      </button>
    </form>
  );
}
