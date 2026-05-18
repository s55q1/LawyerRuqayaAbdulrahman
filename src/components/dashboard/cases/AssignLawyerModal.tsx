"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, X, Check } from "lucide-react";

type Lawyer = { id: string; name: string; _count: { assignedCases: number } };

export default function AssignLawyerModal({
  caseId,
  lawyers,
  currentLawyerId,
}: {
  caseId: string;
  lawyers: Lawyer[];
  currentLawyerId: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(currentLawyerId);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await fetch(`/api/cases/${caseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lawyerId: selected || null }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  };

  const current = lawyers.find(l => l.id === currentLawyerId);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all"
        style={{ borderColor: "#C5A059", color: "#C5A059", background: "rgba(197,160,89,0.06)" }}
      >
        <UserCheck className="w-4 h-4" />
        {current ? `المحامي: ${current.name}` : "تكليف محامي"}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800 text-lg">تكليف محامي للقضية</h2>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-2 mb-5">
              <button
                onClick={() => setSelected(null)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-sm"
                style={{
                  borderColor: selected === null ? "#C5A059" : "#E5E7EB",
                  background: selected === null ? "rgba(197,160,89,0.06)" : "white",
                }}
              >
                <span className="text-gray-500">بدون تكليف</span>
                {selected === null && <Check className="w-4 h-4 text-amber-600" />}
              </button>

              {lawyers.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelected(l.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all"
                  style={{
                    borderColor: selected === l.id ? "#C5A059" : "#E5E7EB",
                    background: selected === l.id ? "rgba(197,160,89,0.06)" : "white",
                  }}
                >
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 text-sm">{l.name}</p>
                    <p className="text-xs text-gray-400">{l._count.assignedCases} قضية حالية</p>
                  </div>
                  {selected === l.id && <Check className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-60"
                style={{ background: "#C5A059" }}
              >
                {loading ? "جاري الحفظ..." : "حفظ التكليف"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
