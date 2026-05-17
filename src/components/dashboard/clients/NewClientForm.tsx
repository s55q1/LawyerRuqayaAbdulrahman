"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClientForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", nationalId: "", address: "", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/clients/${data.id}`);
      } else {
        const data = await res.json();
        setError(data.error || "حدث خطأ");
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
          <label className={labelClass}>الاسم الكامل *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>رقم الجوال *</label>
          <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} dir="ltr" />
        </div>
        <div>
          <label className={labelClass}>البريد الإلكتروني</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} dir="ltr" />
        </div>
        <div>
          <label className={labelClass}>رقم الهوية الوطنية</label>
          <input type="text" value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} className={inputClass} dir="ltr" maxLength={10} />
        </div>
      </div>
      <div>
        <label className={labelClass}>العنوان</label>
        <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>ملاحظات</label>
        <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={`${inputClass} resize-none`} />
      </div>
      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
          {loading ? "جاري الحفظ..." : "حفظ العميل"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          إلغاء
        </button>
      </div>
    </form>
  );
}
