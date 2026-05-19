import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, Phone, User, Bell, Scale } from "lucide-react";
import NewAppointmentModal from "@/components/dashboard/calendar/NewAppointmentModal";
import CalendarGrid from "@/components/dashboard/calendar/CalendarGrid";

const CASE_TYPE_LABELS: Record<string, string> = {
  LABOR: "عمالية", PERSONAL_STATUS: "أحوال شخصية",
  COMMERCIAL: "تجارية", EXECUTION: "تنفيذ",
  CONSULTATION: "استشارات", OTHER: "أخرى",
};

const STATUS_BADGE: Record<string, string> = {
  SCHEDULED: "bg-blue-500/10 text-blue-400",
  COMPLETED:  "bg-emerald-500/10 text-emerald-400",
  CANCELLED:  "bg-red-500/10 text-red-400",
};
const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "مجدول",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

function fmt(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    weekday: "long", day: "numeric", month: "long",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(date);
}

export default async function CalendarPage() {
  const session = await getSession();
  if (!session) return null;

  const isManager = session.role === "MANAGER" || session.role === "LEGAL_SECRETARY";

  const [appointments, hearingSessions, lawyers] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        date: { gte: new Date() },
        ...(isManager ? {} : {
          OR: [{ userId: session.id }, { lawyerId: session.id }],
        }),
      },
      include: { user: true, lawyer: true },
      orderBy: { date: "asc" },
    }),
    prisma.hearingSession.findMany({
      where: { date: { gte: new Date() } },
      include: { case: { include: { client: true } } },
      orderBy: { date: "asc" },
      take: 50,
    }),
    prisma.user.findMany({
      where: { isActive: true, role: { in: ["LAWYER", "MANAGER", "LEGAL_SECRETARY"] } },
      select: { id: true, name: true, role: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Build set of ISO date strings (YYYY-MM-DD) that have sessions or appointments
  const sessionDays = new Set<string>();
  for (const s of hearingSessions) {
    const d = new Date(s.date);
    sessionDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  const appointmentDays = new Set<string>();
  for (const a of appointments) {
    const d = new Date(a.date);
    appointmentDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }

  // Upcoming sessions in next 7 days for notifications
  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const urgentSessions = hearingSessions.filter((s) => new Date(s.date) <= in7);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#C5A059" }}>إدارة الوقت</p>
          <h1 className="text-2xl font-bold" style={{ color: "#F8FAFC" }}>التقويم والمواعيد</h1>
          <p className="text-sm mt-1" style={{ color: "#4A6080" }}>
            {appointments.length} موعد · {hearingSessions.length} جلسة قادمة
          </p>
        </div>
        <NewAppointmentModal userId={session.id} lawyers={lawyers} />
      </div>

      {/* Urgent Notifications */}
      {urgentSessions.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: "rgba(197,160,89,0.08)", border: "1px solid rgba(197,160,89,0.2)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4" style={{ color: "#C5A059" }} />
            <span className="font-bold text-sm" style={{ color: "#C5A059" }}>
              تنبيه: {urgentSessions.length} جلسة في الأيام السبعة القادمة
            </span>
          </div>
          <div className="space-y-2">
            {urgentSessions.map((s) => {
              const d = new Date(s.date);
              const daysLeft = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={s.id} className="flex items-center justify-between text-sm py-2 px-3 rounded-xl"
                  style={{ background: "rgba(0,0,0,0.2)" }}>
                  <div>
                    <span className="font-semibold" style={{ color: "#F1F5F9" }}>{s.case.client.name}</span>
                    <span className="mx-2" style={{ color: "#4A6080" }}>—</span>
                    <span style={{ color: "#94A3B8" }}>{s.case.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#94A3B8" }} dir="ltr">
                      {d.toLocaleDateString("ar-SA")}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      daysLeft <= 1 ? "bg-red-500/20 text-red-400" :
                      daysLeft <= 3 ? "bg-orange-500/20 text-orange-400" :
                      "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {daysLeft === 0 ? "اليوم" : daysLeft === 1 ? "غداً" : `${daysLeft} أيام`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <CalendarGrid
        sessionDays={Array.from(sessionDays)}
        appointmentDays={Array.from(appointmentDays)}
      />

      {/* Upcoming Appointments */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Calendar className="w-4 h-4" style={{ color: "#C5A059" }} />
          <h2 className="font-bold text-sm" style={{ color: "#F1F5F9" }}>المواعيد القادمة ({appointments.length})</h2>
        </div>

        {appointments.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>لا توجد مواعيد قادمة</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {appointments.map((apt) => {
              const d = new Date(apt.date);
              return (
                <div key={apt.id} className="px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#C5A059,#D4A373)", color: "#0B1325" }}>
                      <div className="text-base font-bold leading-none">{d.getDate()}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        {new Intl.DateTimeFormat("ar-SA", { month: "short" }).format(d)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm" style={{ color: "#F1F5F9" }}>{apt.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="flex items-center gap-1 text-xs" style={{ color: "#64748B" }}>
                          <Clock className="w-3 h-3" />
                          {fmt(d)}
                        </span>
                        {apt.clientName && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: "#64748B" }}>
                            <User className="w-3 h-3" />
                            {apt.clientName}
                          </span>
                        )}
                        {apt.phone && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: "#64748B" }}>
                            <Phone className="w-3 h-3" />
                            <span dir="ltr">{apt.phone}</span>
                          </span>
                        )}
                        {apt.caseType && (
                          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(197,160,89,0.12)", color: "#C5A059" }}>
                            <Scale className="w-3 h-3" />
                            {CASE_TYPE_LABELS[apt.caseType] || apt.caseType}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs" style={{ color: "#4A6080" }}>
                        {apt.lawyer && (
                          <span>المحامي: <span className="font-semibold" style={{ color: "#C5A059" }}>{apt.lawyer.name}</span></span>
                        )}
                        {isManager && (
                          <span>أُنشئ بواسطة: {apt.user.name}</span>
                        )}
                      </div>
                      {apt.notes && (
                        <p className="text-xs mt-1 italic" style={{ color: "#4A6080" }}>{apt.notes}</p>
                      )}
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_BADGE[apt.status] || "bg-slate-500/10 text-slate-400"}`}>
                      {STATUS_LABEL[apt.status] || apt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Hearing Sessions */}
      {hearingSessions.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Calendar className="w-4 h-4" style={{ color: "#C5A059" }} />
            <h2 className="font-bold text-sm" style={{ color: "#F1F5F9" }}>جلسات المحاكم القادمة ({hearingSessions.length})</h2>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {hearingSessions.slice(0, 10).map((s) => {
              const d = new Date(s.date);
              const daysLeft = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={s.id} className="px-6 py-3.5 hover:bg-white/5 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(197,160,89,0.1)", border: "1px solid rgba(197,160,89,0.2)" }}>
                      <div className="text-sm font-bold leading-none" style={{ color: "#C5A059" }}>{d.getDate()}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: "#C5A059", opacity: 0.7 }}>
                        {new Intl.DateTimeFormat("ar-SA", { month: "short" }).format(d)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ color: "#F1F5F9" }}>{s.case.client.name}</div>
                      <div className="text-xs truncate" style={{ color: "#4A6080" }}>{s.case.title}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs" style={{ color: "#64748B" }} dir="ltr">
                      {new Intl.DateTimeFormat("ar-SA", { hour: "2-digit", minute: "2-digit", hour12: false }).format(d)}
                    </span>
                    {daysLeft <= 7 && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        daysLeft <= 1 ? "bg-red-500/20 text-red-400" :
                        daysLeft <= 3 ? "bg-orange-500/20 text-orange-400" :
                        "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {daysLeft === 0 ? "اليوم" : daysLeft === 1 ? "غداً" : `${daysLeft} أيام`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
