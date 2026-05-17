"use client";

import { useState } from "react";
import { ThemeConfig, saveThemeConfig } from "@/app/actions/cms";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ThemeForm({ initialTheme }: { initialTheme: ThemeConfig }) {
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await saveThemeConfig(theme);
      alert("تم حفظ الألوان بنجاح!");
      router.refresh();
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Primary Gold */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: "var(--navy-200)" }}>
            اللون الأساسي (الذهبي)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.primaryGold}
              onChange={(e) => setTheme({ ...theme, primaryGold: e.target.value })}
              className="w-12 h-12 rounded cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={theme.primaryGold}
              onChange={(e) => setTheme({ ...theme, primaryGold: e.target.value })}
              className="flex-1 rounded-xl p-3 text-sm focus:outline-none border border-slate-200"
              dir="ltr"
            />
          </div>
        </div>

        {/* Primary Navy */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: "var(--navy-200)" }}>
            لون النصوص الداكنة (الكحلي)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.primaryNavy}
              onChange={(e) => setTheme({ ...theme, primaryNavy: e.target.value })}
              className="w-12 h-12 rounded cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={theme.primaryNavy}
              onChange={(e) => setTheme({ ...theme, primaryNavy: e.target.value })}
              className="flex-1 rounded-xl p-3 text-sm focus:outline-none border border-slate-200"
              dir="ltr"
            />
          </div>
        </div>

        {/* Surface Base */}
        <div>
          <label className="block text-sm font-bold mb-2" style={{ color: "var(--navy-200)" }}>
            لون خلفية الموقع
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.surfaceBase}
              onChange={(e) => setTheme({ ...theme, surfaceBase: e.target.value })}
              className="w-12 h-12 rounded cursor-pointer border-0 p-0"
            />
            <input
              type="text"
              value={theme.surfaceBase}
              onChange={(e) => setTheme({ ...theme, surfaceBase: e.target.value })}
              className="flex-1 rounded-xl p-3 text-sm focus:outline-none border border-slate-200"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn-gold flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </form>
  );
}
