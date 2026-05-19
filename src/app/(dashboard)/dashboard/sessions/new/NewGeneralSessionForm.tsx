"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, Landmark, Award, FileText, ChevronDown } from "lucide-react";

interface CaseOption {
  id: string;
  title: string;
  caseNumber: string;
  client: {
    name: string;
  };
}

interface NewGeneralSessionFormProps {
  cases: CaseOption[];
}

export default function NewGeneralSessionForm({ cases }: NewGeneralSessionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    date: "",
    court: "",
    result: "",
    notes: "",
    nextDate: "",
  });

  const filteredCases = cases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) {
      alert("الرجاء اختيار القضية أولاً");
      return;
    }
    setLoading(true);
    try {
      // POST to the API endpoint for creating a session on a case
      const res = await fetch(`/api/cases/${selectedCaseId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, caseId: selectedCaseId }),
      });

      if (res.ok) {
        // Update case nextSession date in case table if nextDate is provided
        if (form.nextDate) {
          await fetch(`/api/cases/${selectedCaseId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nextSession: form.nextDate }),
          });
        }
        router.push("/dashboard/sessions");
        router.refresh();
      } else {
        alert("حدث خطأ أثناء حفظ الجلسة");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#111A2E] border border-slate-700/60 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-sm";
  const labelClass = "block text-xs font-bold text-[#C5A059] mb-2 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      {/* Search and Select Case */}
      <div className="relative">
        <label className={labelClass}>اختر القضية المعنية بالشركة *</label>
        <div className="relative">
          <input
            type="text"
            placeholder={
              selectedCase
                ? `القضية المختارة: ${selectedCase.caseNumber} - ${selectedCase.title}`
                : "ابحث بالاسم، رقم القضية، أو اسم العميل..."
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className={`${inputClass} pr-11 pl-10`}
          />
          <Search className="w-5 h-5 absolute right-4 top-3.5 text-slate-500" />
          <ChevronDown
            className="w-5 h-5 absolute left-4 top-3.5 text-slate-500 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
        </div>

        {/* Custom searchable dropdown list */}
        {showDropdown && (
          <div className="absolute z-20 w-full mt-2 bg-[#0B1325] border border-slate-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-800">
            {filteredCases.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm">لا توجد نتائج مطابقة لبحثك</div>
            ) : (
              filteredCases.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCaseId(c.id);
                    setSearchTerm("");
                    setShowDropdown(false);
                  }}
                  className="w-full text-right px-4 py-3 hover:bg-[#111A2E] transition-colors flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-white text-sm">{c.title}</span>
                    <span className="text-xs font-mono font-bold text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded">
                      {c.caseNumber}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">العميل: {c.client.name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Selected case preview card */}
      {selectedCase && (
        <div className="p-4 rounded-xl border border-[#C5A059]/20 bg-[#C5A059]/5 flex flex-col gap-1.5 animate-fade-in">
          <div className="text-xs font-bold text-[#C5A059] uppercase">تفاصيل القضية المحددة:</div>
          <div className="text-sm font-bold text-white">
            {selectedCase.title} ({selectedCase.caseNumber})
          </div>
          <div className="text-xs text-slate-300">العميل: {selectedCase.client.name}</div>
        </div>
      )}

      {/* Session fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>تاريخ ووقت الجلسة *</label>
          <div className="relative">
            <input
              type="datetime-local"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>المحكمة / الدائرة</label>
          <div className="relative">
            <input
              type="text"
              value={form.court}
              onChange={(e) => setForm({ ...form, court: e.target.value })}
              className={`${inputClass} pr-11`}
              placeholder="المحكمة العمالية، الدائرة الرابعة"
            />
            <Landmark className="w-5 h-5 absolute right-4 top-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>نتيجة الجلسة</label>
          <div className="relative">
            <input
              type="text"
              value={form.result}
              onChange={(e) => setForm({ ...form, result: e.target.value })}
              className={`${inputClass} pr-11`}
              placeholder="تأجيل لتقديم بينة / حجز للحكم"
            />
            <Award className="w-5 h-5 absolute right-4 top-3.5 text-slate-500" />
          </div>
        </div>
        <div>
          <label className={labelClass}>تاريخ الجلسة القادمة (إن وجد)</label>
          <div className="relative">
            <input
              type="datetime-local"
              value={form.nextDate}
              onChange={(e) => setForm({ ...form, nextDate: e.target.value })}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>الملاحظات وتفاصيل الجلسة</label>
        <div className="relative">
          <textarea
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className={`${inputClass} pr-11 resize-none`}
            placeholder="اكتب خلاصة ما تم بالجلسة أو الرابط الإلكتروني للاجتماع..."
          />
          <FileText className="w-5 h-5 absolute right-4 top-3.5 text-slate-500" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-8 py-3.5 bg-gradient-to-r from-[#C5A059] to-[#D4A373] hover:from-[#B48F48] hover:to-[#C5A059] text-[#0B1325] hover:scale-[1.02] active:scale-[0.98] font-bold text-sm rounded-xl shadow-lg shadow-[#C5A059]/10 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? "جاري تسجيل الجلسة..." : "تسجيل الجلسة والانتهاء"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3.5 border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-sm rounded-xl transition-all"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
