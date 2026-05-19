"use client";
import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center gap-4 transition-opacity duration-500">
      <img
        src="/images/logo-dark.png"
        alt="شركة رقية عبدالرحمن"
        className="w-64 h-64 object-contain"
      />
      <p className="text-[#0B1325] font-bold text-xl font-arabic">شريكك القانوني</p>
      <p className="text-gray-400 text-sm font-arabic">جار التحميل ...</p>
    </div>
  );
}
