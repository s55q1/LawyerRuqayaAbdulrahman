"use client";

import { useState } from "react";
import { HomeConfig, saveHomeConfig } from "@/app/actions/cms";
import { Save, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomeForm({ initialConfig }: { initialConfig: HomeConfig }) {
  const [config, setConfig] = useState<HomeConfig>(initialConfig);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await saveHomeConfig(config);
      alert("تم حفظ النصوص بنجاح!");
      router.refresh();
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
    }
    setLoading(false);
  }

  const addFeature = () => setConfig({ ...config, heroFeatures: [...config.heroFeatures, "ميزة جديدة"] });
  const updateFeature = (index: number, val: string) => {
    const arr = [...config.heroFeatures];
    arr[index] = val;
    setConfig({ ...config, heroFeatures: arr });
  };
  const removeFeature = (index: number) => {
    const arr = [...config.heroFeatures];
    arr.splice(index, 1);
    setConfig({ ...config, heroFeatures: arr });
  };

  const addStat = () => setConfig({ ...config, aboutStats: [...config.aboutStats, { label: "عنوان الإحصائية", value: "0" }] });
  const updateStat = (index: number, key: "label"|"value", val: string) => {
    const arr = [...config.aboutStats];
    arr[index][key] = val;
    setConfig({ ...config, aboutStats: arr });
  };
  const removeStat = (index: number) => {
    const arr = [...config.aboutStats];
    arr.splice(index, 1);
    setConfig({ ...config, aboutStats: arr });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* القسم الأول Hero */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--navy-200)" }}>القسم الأول (أعلى الصفحة)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">العنوان الرئيسي</label>
            <input type="text" value={config.heroTitle} onChange={e => setConfig({...config, heroTitle: e.target.value})} className="input" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">النص الفرعي</label>
            <textarea value={config.heroSubtitle} onChange={e => setConfig({...config, heroSubtitle: e.target.value})} className="textarea h-20" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">مميزات (النقاط أسفل العنوان)</label>
            <div className="space-y-2">
              {config.heroFeatures.map((feat, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={feat} onChange={e => updateFeature(i, e.target.value)} className="input flex-1" />
                  <button type="button" onClick={() => removeFeature(i)} className="btn-icon"><Trash className="w-4 h-4 text-red-500"/></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addFeature} className="text-sm font-bold mt-2 text-gold-600 flex items-center gap-1"><Plus className="w-4 h-4"/> إضافة ميزة</button>
          </div>
        </div>
      </div>

      {/* قسم من نحن */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--navy-200)" }}>قسم من نحن</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">عنوان القسم</label>
            <input type="text" value={config.aboutTitle} onChange={e => setConfig({...config, aboutTitle: e.target.value})} className="input" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">نص الوصف (من نحن)</label>
            <textarea value={config.aboutText} onChange={e => setConfig({...config, aboutText: e.target.value})} className="textarea h-32" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">الإحصائيات والأرقام</label>
            <div className="space-y-3">
              {config.aboutStats.map((stat, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" placeholder="الرقم (مثال: 15+)" value={stat.value} onChange={e => updateStat(i, "value", e.target.value)} className="input w-1/3 text-center" />
                  <input type="text" placeholder="الوصف (مثال: سنوات خبرة)" value={stat.label} onChange={e => updateStat(i, "label", e.target.value)} className="input flex-1" />
                  <button type="button" onClick={() => removeStat(i)} className="btn-icon"><Trash className="w-4 h-4 text-red-500"/></button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addStat} className="text-sm font-bold mt-2 text-gold-600 flex items-center gap-1"><Plus className="w-4 h-4"/> إضافة إحصائية</button>
          </div>
        </div>
      </div>

      {/* قسم الخدمات و التواصل */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6" style={{ color: "var(--navy-200)" }}>نصوص الأقسام الأخرى</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">عنوان قسم الخدمات</label>
              <input type="text" value={config.servicesTitle} onChange={e => setConfig({...config, servicesTitle: e.target.value})} className="input" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">نص فرعي للخدمات</label>
              <textarea value={config.servicesSubtitle} onChange={e => setConfig({...config, servicesSubtitle: e.target.value})} className="textarea h-20" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">عنوان قسم التواصل</label>
              <input type="text" value={config.contactTitle} onChange={e => setConfig({...config, contactTitle: e.target.value})} className="input" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">نص فرعي للتواصل</label>
              <textarea value={config.contactSubtitle} onChange={e => setConfig({...config, contactSubtitle: e.target.value})} className="textarea h-20" />
            </div>
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
