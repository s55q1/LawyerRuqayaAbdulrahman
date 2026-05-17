"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export default function NewAppointmentModal({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", date: "", duration: "60", clientName: "", phone: "", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId, duration: parseInt(form.duration) }),
      });
      if (res.ok) {
        setOpen(false);
        setForm({ title: "", date: "", duration: "60", clientName: "", phone: "", notes: "" });
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500";

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" /> موعد جديد
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-primary-700 text-xl">موعد جديد</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">عنوان الموعد *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="استشارة قانونية / جلسة محكمة..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">التاريخ والوقت *</label>
                  <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">المدة (دقيقة)</label>
                  <select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className={`${inputClass} bg-white`}>
                    <option value="30">30 دقيقة</option>
                    <option value="60">ساعة</option>
                    <option value="90">ساعة ونصف</option>
                    <option value="120">ساعتان</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">اسم العميل</label>
                  <input type="text" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الجوال</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} dir="ltr" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ملاحظات</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputClass} resize-none`} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
                  {loading ? "جاري الحفظ..." : "حفظ الموعد"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="px-4 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
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
