"use client";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", phone: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-primary-700 mb-2">تم إرسال رسالتك بنجاح!</h3>
        <p className="text-gray-600">سنتواصل معك في أقرب وقت ممكن</p>
        <button onClick={() => setStatus("idle")} className="btn-primary mt-6">
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم الكامل *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="محمد أحمد"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">رقم الجوال *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            placeholder="05XXXXXXXX"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="example@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">موضوع الاستفسار</label>
        <select
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
        >
          <option value="">اختر الموضوع</option>
          <option value="قضايا عمالية">قضايا عمالية</option>
          <option value="أحوال شخصية">أحوال شخصية</option>
          <option value="قضايا تجارية">قضايا تجارية</option>
          <option value="تنفيذ">تنفيذ</option>
          <option value="استشارة">استشارة قانونية</option>
          <option value="أخرى">أخرى</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">رسالتك *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
          placeholder="اكتب رسالتك أو استفسارك هنا..."
        />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm">حدث خطأ، يرجى المحاولة مرة أخرى</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <span>جاري الإرسال...</span>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>إرسال الرسالة</span>
          </>
        )}
      </button>
    </form>
  );
}
