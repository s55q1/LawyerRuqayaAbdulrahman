"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Client, User } from "@prisma/client";

type Props = {
  clients: Client[];
  lawyers: User[];
  createdById: string;
};

export default function NewCaseForm({ clients, lawyers, createdById }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    caseNumber: "",
    type: "OTHER",
    clientId: "",
    lawyerId: "",
    court: "",
    description: "",
    nextSession: "",
    appealDeadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, createdById }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/cases/${data.id}`);
      } else {
        const data = await res.json();
        setError(data.error || "حدث خطأ أثناء الحفظ");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>عنوان القضية *</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="مثال: قضية عمالية ضد شركة..." />
        </div>
        <div>
          <label className={labelClass}>رقم القضية *</label>
          <input type="text" required value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} className={inputClass} placeholder="مثال: 2024/1234" dir="ltr" />
        </div>
        <div>
          <label className={labelClass}>نوع القضية *</label>
          <select required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={`${inputClass} bg-white`}>
            <option value="LABOR">قضايا عمالية</option>
            <option value="PERSONAL_STATUS">أحوال شخصية</option>
            <option value="COMMERCIAL">قضايا تجارية</option>
            <option value="EXECUTION">تنفيذ</option>
            <option value="CONSULTATION">استشارات</option>
            <option value="OTHER">أخرى</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>العميل *</label>
          <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className={`${inputClass} bg-white`}>
            <option value="">اختر العميل</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>المحامي المسؤول</label>
          <select value={form.lawyerId} onChange={(e) => setForm({ ...form, lawyerId: e.target.value })} className={`${inputClass} bg-white`}>
            <option value="">اختر المحامي</option>
            {lawyers.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>المحكمة</label>
          <input type="text" value={form.court} onChange={(e) => setForm({ ...form, court: e.target.value })} className={inputClass} placeholder="مثال: المحكمة العمالية بالرياض" />
        </div>
        <div>
          <label className={labelClass}>موعد الجلسة القادمة</label>
          <input type="datetime-local" value={form.nextSession} onChange={(e) => setForm({ ...form, nextSession: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>مدة الاستئناف</label>
          <input type="date" value={form.appealDeadline} onChange={(e) => setForm({ ...form, appealDeadline: e.target.value })} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>وصف القضية</label>
        <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} placeholder="تفاصيل القضية..." />
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
          {loading ? "جاري الحفظ..." : "حفظ القضية"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          إلغاء
        </button>
      </div>
    </form>
  );
}
