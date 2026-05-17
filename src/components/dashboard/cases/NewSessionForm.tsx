"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSessionForm({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: "", court: "", result: "", notes: "", nextDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, caseId }),
      });
      if (res.ok) {
        // Update case nextSession if provided
        if (form.nextDate) {
          await fetch(`/api/cases/${caseId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nextSession: form.nextDate }),
          });
        }
        router.push(`/dashboard/cases/${caseId}`);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>تاريخ الجلسة *</label>
          <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>المحكمة</label>
          <input type="text" value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })} className={inputClass} placeholder="المحكمة العمالية بالرياض" />
        </div>
      </div>
      <div>
        <label className={labelClass}>نتيجة الجلسة</label>
        <input type="text" value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} className={inputClass} placeholder="تأجيل / صدور حكم / إجراء..." />
      </div>
      <div>
        <label className={labelClass}>موعد الجلسة التالية</label>
        <input type="datetime-local" value={form.nextDate} onChange={(e) => setForm({ ...form, nextDate: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>ملاحظات</label>
        <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputClass} resize-none`} />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
          {loading ? "جاري الحفظ..." : "تسجيل الجلسة"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  );
}
