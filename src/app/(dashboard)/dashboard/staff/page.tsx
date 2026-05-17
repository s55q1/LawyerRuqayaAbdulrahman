import { getSession, hasRole } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, CheckCircle, XCircle, Scale } from "lucide-react";
import NewStaffModal from "@/components/dashboard/staff/NewStaffModal";

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "badge-navy",
  LAWYER: "badge-blue",
  ACCOUNTANT: "badge-green",
  SECRETARY: "badge-yellow",
};

const ROLE_AVATAR_COLOR: Record<string, string> = {
  ADMIN: "from-navy-700 to-navy-500",
  LAWYER: "from-blue-600 to-blue-400",
  ACCOUNTANT: "from-emerald-600 to-emerald-400",
  SECRETARY: "from-amber-600 to-amber-400",
};

export default async function StaffPage() {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "HR_MANAGER")) {
    redirect("/dashboard");
  }

  const staff = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { assignedCases: true } } },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gold-600 font-semibold mb-1">إدارة الأعضاء</p>
          <h1 className="text-2xl font-bold text-navy-900">الفريق</h1>
          <p className="text-sm text-gray-500 mt-1">{staff.length} عضو</p>
        </div>
        <NewStaffModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <div key={member.id} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 bg-gradient-to-br ${ROLE_AVATAR_COLOR[member.role] || "from-gray-500 to-gray-400"}`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-navy-800">{member.name}</h3>
                  <span className={`badge ${ROLE_BADGE[member.role] || "badge-gray"}`}>
                    {ROLE_LABELS[member.role] || member.role}
                  </span>
                </div>
              </div>
              {member.isActive ? (
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>نشط</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                  <XCircle className="w-4 h-4" />
                  <span>غير نشط</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm pt-3 border-t border-gray-50">
              <div className="flex items-center gap-2 text-gray-500">
                <Mail className="w-3.5 h-3.5 text-gold-500" />
                <span dir="ltr" className="text-xs truncate">{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-gold-500" />
                  <span dir="ltr" className="text-xs font-mono">{member.phone}</span>
                </div>
              )}
            </div>

            {member.role === "LAWYER" && (
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-sm">
                <Scale className="w-4 h-4 text-navy-400" />
                <span className="text-gray-500">القضايا المسندة:</span>
                <span className="font-bold text-navy-700">{member._count.assignedCases}</span>
              </div>
            )}

            <div className="text-xs text-gray-400 mt-3">
              عضو منذ {formatDate(member.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
