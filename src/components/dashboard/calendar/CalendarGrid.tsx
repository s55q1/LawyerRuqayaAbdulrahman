"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  sessionDays: string[];   // "YYYY-M-D" keys
  appointmentDays: string[]; // "YYYY-M-D" keys
}

const WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export default function CalendarGrid({ sessionDays, appointmentDays }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const sessionSet = new Set(sessionDays);
  const appointmentSet = new Set(appointmentDays);

  function key(y: number, m: number, d: number) {
    return `${y}-${m}-${d}`;
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Month nav */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/10 transition-colors" style={{ color: "#C5A059" }}>
          <ChevronRight className="w-4 h-4" />
        </button>
        <h2 className="font-bold text-sm" style={{ color: "#F1F5F9" }}>
          {ARABIC_MONTHS[month]} {year}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/10 transition-colors" style={{ color: "#C5A059" }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="px-6 py-2 flex items-center gap-4 text-xs" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", color: "#4A6080" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#C5A059" }} />
          <span>جلسة محكمة</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <span>موعد</span>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-2 pt-3 pb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-bold py-1" style={{ color: "#4A6080" }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 px-2 pb-4">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const k = key(year, month, day);
          const hasSession = sessionSet.has(k);
          const hasAppointment = appointmentSet.has(k);
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

          return (
            <div
              key={k}
              className="relative flex flex-col items-center justify-center rounded-xl py-2 transition-colors"
              style={{
                background: isToday
                  ? "linear-gradient(135deg,#C5A059,#D4A373)"
                  : hasSession
                  ? "rgba(197,160,89,0.12)"
                  : hasAppointment
                  ? "rgba(59,130,246,0.1)"
                  : "transparent",
                border: isToday
                  ? "none"
                  : hasSession || hasAppointment
                  ? `1px solid ${hasSession ? "rgba(197,160,89,0.3)" : "rgba(59,130,246,0.3)"}`
                  : "1px solid transparent",
                minHeight: "2.5rem",
              }}
            >
              <span
                className="text-sm font-bold"
                style={{
                  color: isToday ? "#0B1325" : hasSession ? "#C5A059" : hasAppointment ? "#60A5FA" : "#94A3B8",
                }}
              >
                {day}
              </span>
              {(hasSession || hasAppointment) && !isToday && (
                <div className="flex gap-0.5 mt-0.5">
                  {hasSession && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#C5A059" }} />}
                  {hasAppointment && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
