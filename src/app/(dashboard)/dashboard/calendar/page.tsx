import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { Calendar, Clock, Phone, User } from "lucide-react";
import NewAppointmentModal from "@/components/dashboard/calendar/NewAppointmentModal";

const STATUS_BADGE: Record<string, string> = {
  SCHEDULED: "badge-blue",
  COMPLETED: "badge-green",
  CANCELLED: "badge-red",
};

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: "مجدول",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

export default async function CalendarPage() {
  const session = await getSession();
  if (!session) return null;

  const isAdmin = session.role === "ADMIN";

  const [appointments, pastAppointments] = await Promise.all([
    prisma.appointment.findMany({
      where: { date: { gte: new Date() }, ...(isAdmin ? {} : { userId: session.id }) },
      include: { user: true },
      orderBy: { date: "asc" },
    }),
    prisma.appointment.findMany({
      where: { date: { lt: new Date() }, ...(isAdmin ? {} : { userId: session.id }) },
      include: { user: true },
      orderBy: { date: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gold-600 font-semibold mb-1">إدارة الوقت</p>
          <h1 className="text-2xl font-bold text-navy-900">التقويم والمواعيد</h1>
          <p className="text-sm text-gray-500 mt-1">{appointments.length} موعد قادم</p>
        </div>
        <NewAppointmentModal userId={session.id} />
      </div>

      {/* Upcoming */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gold-500" />
          <h2 className="font-bold text-navy-800">المواعيد القادمة</h2>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state py-16">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 font-medium">لا توجد مواعيد قادمة</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appointments.map((apt) => {
              const d = new Date(apt.date);
              return (
                <div key={apt.id} className="px-6 py-4 hover:bg-gray-50/80 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-gold-gradient rounded-xl flex flex-col items-center justify-center flex-shrink-0 shadow-gold text-white">
                        <div className="text-lg font-bold leading-none">{d.getDate()}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">
                          {new Intl.DateTimeFormat("ar-SA", { month: "short" }).format(d)}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-800">{apt.title}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(apt.date)}
                          </span>
                          <span className="text-gray-300">·</span>
                          <span>{apt.duration} دقيقة</span>
                        </div>
                        {apt.clientName && (
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {apt.clientName}
                          </div>
                        )}
                        {apt.phone && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span dir="ltr" className="font-mono">{apt.phone}</span>
                          </div>
                        )}
                        {isAdmin && (
                          <div className="text-xs text-gray-400 mt-0.5">المسؤول: {apt.user.name}</div>
                        )}
                        {apt.notes && (
                          <p className="text-xs text-gray-400 mt-1 italic">{apt.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className={`badge flex-shrink-0 ${STATUS_BADGE[apt.status] || "badge-gray"}`}>
                      {STATUS_LABEL[apt.status] || apt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past */}
      {pastAppointments.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-500 text-sm">المواعيد السابقة</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {pastAppointments.map((apt) => (
              <div key={apt.id} className="px-6 py-3 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-gray-700">{apt.title}</div>
                    <div className="text-xs text-gray-400">{formatDateTime(apt.date)}</div>
                  </div>
                  <span className={`badge ${STATUS_BADGE[apt.status] || "badge-gray"}`}>
                    {STATUS_LABEL[apt.status] || apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
