"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddReceiptForm({ contractId }: { contractId: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ amount: "", paymentMethod: "cash", notes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/finance/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, contractId, amount: parseFloat(form.amount) }),
      });
      setForm({ amount: "", paymentMethod: "cash", notes: "" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 w-full";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2">
      <input type="number" required min="1" placeholder="المبلغ" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputClass} />
      <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className={`${inputClass} bg-white`}>
        <option value="cash">نقداً</option>
        <option value="bank">تحويل بنكي</option>
        <option value="check">شيك</option>
        <option value="card">بطاقة</option>
      </select>
      <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-70">
        {loading ? "..." : "+ تسجيل"}
      </button>
    </form>
  );
}
