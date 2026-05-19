"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

const CASE_TYPES = [
  { value: "",               label: "نوع القضية (اختياري)" },
  { value: "LABOR",          label: "قضايا عمالية" },
  { value: "PERSONAL_STATUS",label: "أحوال شخصية" },
  { value: "COMMERCIAL",     label: "قضايا تجارية" },
  { value: "EXECUTION",      label: "تنفيذ" },
  { value: "CONSULTATION",   label: "استشارات" },
  { value: "OTHER",          label: "أخرى" },
];

interface Lawyer {
  id: string;
  name: string;
  role: string;
}

interface Props {
  userId: string;
  lawyers: Lawyer[];
}

export default function NewAppointmentModal({ userId, lawyers }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", date: "", duration: "60",
    clientName: "", phone: "", notes: "",
    caseType: "", lawyerId: "",
  });

  const ROLE_LABEL: Record<string, string> = {
    MANAGER: "مدير", LAWYER: "محامي", LEGAL_SECRETARY: "سكرتير قانوني",
  };

  function reset() {
    setForm({ title: "", date: "", duration: "60", clientName: "", phone: "", notes: "", caseType: "", lawyerId: "" });
    setError("");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userId,
          duration: parseInt(form.duration),
          caseType: form.caseType || null,
          lawyerId: form.lawyerId || null,
        }),
      });
      if (res.ok) {
        setOpen(false);
        reset();
        router.refresh();
      } else {
        setError("حدث خطأ في الحفظ");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-white";
  const lbl = "block text-sm font-bold text-gray-700 mb-1.5";

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-md"
        style={{ background: "linear-gradient(135deg,#C5A059,#D4A373)", color: "#0B1325" }}>
        <Plus className="w-4 h-4" /> موعد جديد
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-xl" style={{ color: "#0B1325" }}>موعد جديد</h2>
              <button onClick={() => { setOpen(false); reset(); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Title */}
              <div>
                <label className={lbl}>عنوان الموعد *</label>
                <input type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inp} placeholder="استشارة قانونية / جلسة محكمة..." />
              </div>

              {/* Date + Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>التاريخ والوقت *</label>
                  <input type="datetime-local" required value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inp} />
                </div>
                <div>
                  <label className={lbl}>المدة</label>
                  <select value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className={`${inp} bg-white`}>
                    <option value="30">30 دقيقة</option>
                    <option value="60">ساعة</option>
                    <option value="90">ساعة ونصف</option>
                    <option value="120">ساعتان</option>
                  </select>
                </div>
              </div>

              {/* Case type + Lawyer */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>نوع القضية</label>
                  <select value={form.caseType}
                    onChange={(e) => setForm({ ...form, caseType: e.target.value })}
                    className={`${inp} bg-white`}>
                    {CASE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lbl}>المحامي / المسؤول</label>
                  <select value={form.lawyerId}
                    onChange={(e) => setForm({ ...form, lawyerId: e.target.value })}
                    className={`${inp} bg-white`}>
                    <option value="">اختر (اختياري)</option>
                    {lawyers.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} — {ROLE_LABEL[l.role] || l.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>اسم العميل</label>
                  <input type="text" value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    className={inp} />
                </div>
                <div>
                  <label className={lbl}>الجوال</label>
                  <input type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inp} dir="ltr" placeholder="05XXXXXXXX" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={lbl}>ملاحظات</label>
                <textarea rows={2} value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className={`${inp} resize-none`} />
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={loading}
                  className="flex-1 py-3 rounded-xl font-bold text-sm disabled:opacity-60 transition-all"
                  style={{ background: "linear-gradient(135deg,#C5A059,#D4A373)", color: "#0B1325" }}>
                  {loading ? "جاري الحفظ..." : "حفظ الموعد"}
                </button>
                <button type="button" onClick={() => { setOpen(false); reset(); }}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
