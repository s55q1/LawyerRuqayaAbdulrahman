"use client";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

interface Case {
  id: string;
  title: string;
  status: string;
  caseNumber: string;
  client: { name: string };
}

interface Props {
  cases: Case[];
  statusBadge: Record<string, string>;
  statusLabel: Record<string, string>;
}

export default function RecentCasesCard({ cases, statusBadge, statusLabel }: Props) {
  if (cases.length === 0) {
    return (
      <div className="lg:col-span-3 card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 className="font-bold" style={{ color: "#F8FAFC" }}>أحدث القضايا</h2>
          <Link href="/dashboard/cases" className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: "#D4A373" }}>
            عرض الكل <ArrowLeft className="w-3 h-3 rotate-180" />
          </Link>
        </div>
        <div className="empty-state">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(255,255,255,0.04)" }}>
            <Scale className="w-8 h-8" style={{ color: "#2A3A52" }} />
          </div>
          <p className="font-medium" style={{ color: "#334865" }}>لا توجد قضايا بعد</p>
          <Link href="/dashboard/cases/new" className="btn-gold mt-4 text-sm">إضافة قضية</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3 card overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <h2 className="font-bold" style={{ color: "#F8FAFC" }}>أحدث القضايا</h2>
        <Link href="/dashboard/cases" className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: "#D4A373" }}>
          عرض الكل <ArrowLeft className="w-3 h-3 rotate-180" />
        </Link>
      </div>
      <div>
        {cases.map((c) => (
          <Link key={c.id} href={`/dashboard/cases/${c.id}`}>
            <div
              className="px-6 py-4 flex items-center justify-between group transition-colors hover:bg-white/[0.02]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ background: "rgba(74,96,128,0.15)" }}>
                  <Scale className="w-4 h-4" style={{ color: "#6B82A0" }} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: "#F8FAFC" }}>{c.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#334865" }}>{c.client.name} · {c.caseNumber}</div>
                </div>
              </div>
              <span className={`badge flex-shrink-0 mr-3 ${statusBadge[c.status] || "badge-gray"}`}>
                {statusLabel[c.status] || c.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
