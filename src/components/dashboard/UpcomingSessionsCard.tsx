"use client";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

interface Case {
  id: string;
  title: string;
  nextSession: string | null;
  client: { name: string };
}

interface Props {
  sessions: Case[];
}

export default function UpcomingSessionsCard({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="lg:col-span-2 card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 className="font-bold" style={{ color: "#F8FAFC" }}>جلسات قادمة</h2>
          <Link href="/dashboard/calendar" className="text-xs font-semibold flex items-center gap-1" style={{ color: "#D4A373" }}>
            التقويم <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>←</span>
          </Link>
        </div>
        <div className="empty-state">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(255,255,255,0.04)" }}>
            <Calendar className="w-7 h-7" style={{ color: "#2A3A52" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "#334865" }}>لا توجد جلسات قادمة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 card overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 className="font-bold" style={{ color: "#F8FAFC" }}>جلسات قادمة</h2>
        <Link href="/dashboard/calendar" className="text-xs font-semibold flex items-center gap-1" style={{ color: "#D4A373" }}>
          التقويم <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>←</span>
        </Link>
      </div>
      <div className="p-3 space-y-1">
        {sessions.map((c) => {
          const d = c.nextSession ? new Date(c.nextSession) : null;
          return (
            <Link key={c.id} href={`/dashboard/cases/${c.id}`}>
              <div className="rounded-xl px-3 py-3 flex items-center gap-3 transition-colors hover:bg-white/[0.03]">
                <div
                  className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white"
                  style={{
                    background: "linear-gradient(135deg, #C9975B, #D4A373)",
                    boxShadow: "0 4px 12px rgba(212,163,115,0.25)",
                    color: "#1a1000",
                  }}
                >
                  <div className="text-sm font-bold leading-none">{d?.getDate()}</div>
                  <div className="text-[9px] opacity-80 mt-0.5">
                    {d ? new Intl.DateTimeFormat("ar-SA", { month: "short" }).format(d) : ""}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: "#F8FAFC" }}>{c.title}</div>
                  <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#334865" }}>
                    <Clock className="w-3 h-3" />
                    {c.client.name}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
