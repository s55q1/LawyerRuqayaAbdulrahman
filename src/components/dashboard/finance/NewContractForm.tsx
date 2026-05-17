"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Case, Client } from "@prisma/client";

type CaseWithClient = Case & { client: Client };

export default function NewContractForm({ cases, defaultCaseId }: { cases: CaseWithClient[]; defaultCaseId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    contractNumber: `CNT-${Date.now()}`,
    caseId: defaultCaseId || "",
    totalAmount: "",
    notes: "",
  });

  const selectedCase = cases.find((c) => c.id === form.caseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/finance/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalAmount: parseFloat(form.totalAmount),
          clientId: selectedCase?.clientId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/finance/${data.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">رقم العقد</label>
        <input type="text" required value={form.contractNumber} onChange={(e) => setForm({ ...form, contractNumber: e.target.value })} className={inputClass} dir="ltr" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">القضية *</label>
        <select required value={form.caseId} onChange={(e) => setForm({ ...form, caseId: e.target.value })} className={`${inputClass} bg-white`}>
          <option value="">اختر القضية</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>{c.title} - {c.client.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">قيمة العقد (ريال) *</label>
        <input type="number" required min="1" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">ملاحظات</label>
        <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputClass} resize-none`} />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
          {loading ? "جاري الحفظ..." : "حفظ العقد"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  );
}
