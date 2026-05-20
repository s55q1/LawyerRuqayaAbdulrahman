"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, FileText, Image } from "lucide-react";

const CASE_TYPES = [
  { value: "", label: "اختر نوع القضية" },
  { value: "LABOR",           label: "قضايا عمالية" },
  { value: "PERSONAL_STATUS", label: "أحوال شخصية" },
  { value: "COMMERCIAL",      label: "قضايا تجارية" },
  { value: "EXECUTION",       label: "تنفيذ" },
  { value: "CONSULTATION",    label: "استشارات" },
  { value: "OTHER",           label: "أخرى" },
];

export default function NewClientForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", nationalId: "",
    address: "", notes: "", caseType: "",
  });
  const [attachment, setAttachment] = useState<{
    name: string; size: string; dataUrl: string; isImage: boolean;
  } | null>(null);
  const [fileError, setFileError] = useState("");

  function handleFile(file: File) {
    setFileError("");
    const MAX = 2 * 1024 * 1024; // 2 MB
    if (file.size > MAX) {
      setFileError("حجم الملف كبير جداً — الحد الأقصى 2 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(0) + " كB",
        dataUrl,
        isImage: file.type.startsWith("image/"),
      });
    };
    reader.readAsDataURL(file);
  }

  function onFileDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          attachmentUrl: attachment?.dataUrl || null,
        }),
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

  const inp = "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm";
  const lbl = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">

      {/* Basic info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={lbl}>الاسم الكامل *</label>
          <input type="text" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inp} placeholder="محمد أحمد العلي" />
        </div>
        <div>
          <label className={lbl}>رقم الجوال *</label>
          <input type="tel" required value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inp} dir="ltr" placeholder="05XXXXXXXX" />
        </div>
        <div>
          <label className={lbl}>البريد الإلكتروني</label>
          <input type="email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inp} dir="ltr" />
        </div>
        <div>
          <label className={lbl}>رقم الهوية الوطنية</label>
          <input type="text" value={form.nationalId}
            onChange={(e) => setForm({ ...form, nationalId: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            className={`${inp} ${form.nationalId && form.nationalId.length !== 10 ? "border-red-300 focus:border-red-400 focus:ring-red-400" : ""}`}
            dir="ltr" maxLength={10} placeholder="1XXXXXXXXX" />
          {form.nationalId && form.nationalId.length !== 10 && (
            <p className="text-red-500 text-xs mt-1">رقم الهوية يجب أن يكون 10 أرقام</p>
          )}
        </div>
      </div>

      {/* Case type */}
      <div>
        <label className={lbl}>نوع القضية</label>
        <select
          value={form.caseType}
          onChange={(e) => setForm({ ...form, caseType: e.target.value })}
          className={inp}
        >
          {CASE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Address */}
      <div>
        <label className={lbl}>العنوان</label>
        <input type="text" value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className={inp} />
      </div>

      {/* Notes */}
      <div>
        <label className={lbl}>ملاحظات</label>
        <textarea rows={3} value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className={`${inp} resize-none`} />
      </div>

      {/* File upload */}
      <div>
        <label className={lbl}>رفع ملف أو صورة (اختياري — حد أقصى 2 ميجابايت)</label>

        {!attachment ? (
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={onFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/40 transition-all"
          >
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500 font-medium">اضغط لاختيار ملف أو اسحبه هنا</p>
            <p className="text-xs text-gray-400 mt-1">صور (JPG, PNG) · PDF · Word · Excel</p>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-4 border border-amber-200 rounded-xl p-4 bg-amber-50/40">
            {attachment.isImage ? (
              <img src={attachment.dataUrl} alt="preview"
                className="w-14 h-14 object-cover rounded-lg border border-amber-200 flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-amber-600" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{attachment.name}</p>
              <p className="text-xs text-gray-500">{attachment.size}</p>
            </div>
            <button type="button" onClick={() => setAttachment(null)}
              className="p-1.5 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}

        {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
      </div>

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-70"
          style={{ background: "linear-gradient(135deg,#C5A059,#D4A373)", color: "#0B1325" }}>
          {loading ? "جاري الحفظ..." : "حفظ العميل"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">
          إلغاء
        </button>
      </div>
    </form>
  );
}
