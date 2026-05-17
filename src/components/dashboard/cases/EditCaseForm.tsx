"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Case, Client, User } from "@prisma/client";

type Props = {
  caseData: Case;
  clients: Client[];
  lawyers: User[];
};

export default function EditCaseForm({ caseData, clients, lawyers }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: caseData.title,
    type: caseData.type,
    status: caseData.status,
    clientId: caseData.clientId,
    lawyerId: caseData.lawyerId || "",
    court: caseData.court || "",
    description: caseData.description || "",
    nextSession: caseData.nextSession ? new Date(caseData.nextSession).toISOString().slice(0, 16) : "",
    appealDeadline: caseData.appealDeadline ? new Date(caseData.appealDeadline).toISOString().slice(0, 10) : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/cases/${caseData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nextSession: form.nextSession || null,
          appealDeadline: form.appealDeadline || null,
          lawyerId: form.lawyerId || null,
        }),
      });
      if (res.ok) {
        router.push(`/dashboard/cases/${caseData.id}`);
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
        <div className="md:col-span-2">
          <label className={labelClass}>عنوان القضية *</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>نوع القضية</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className={`${inputClass} bg-white`}>
            <option value="LABOR">قضايا عمالية</option>
            <option value="PERSONAL_STATUS">أحوال شخصية</option>
            <option value="COMMERCIAL">قضايا تجارية</option>
            <option value="EXECUTION">تنفيذ</option>
            <option value="CONSULTATION">استشارات</option>
            <option value="OTHER">أخرى</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>حالة القضية</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className={`${inputClass} bg-white`}>
            <option value="ACTIVE">نشطة</option>
            <option value="CLOSED">مغلقة</option>
            <option value="SUSPENDED">موقوفة</option>
            <option value="WON">مكسوبة</option>
            <option value="LOST">مخسورة</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>العميل</label>
          <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className={`${inputClass} bg-white`}>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>المحامي المسؤول</label>
          <select value={form.lawyerId} onChange={(e) => setForm({ ...form, lawyerId: e.target.value })} className={`${inputClass} bg-white`}>
            <option value="">بدون محامي</option>
            {lawyers.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>المحكمة</label>
          <input type="text" value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>الجلسة القادمة</label>
          <input type="datetime-local" value={form.nextSession} onChange={(e) => setForm({ ...form, nextSession: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>مدة الاستئناف</label>
          <input type="date" value={form.appealDeadline} onChange={(e) => setForm({ ...form, appealDeadline: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>وصف القضية</label>
        <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
          {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  );
}
