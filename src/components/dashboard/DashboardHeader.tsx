"use client";
import { Bell, Search } from "lucide-react";
import { SessionUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";



export default function DashboardHeader({ user }: { user: SessionUser }) {
  return (
    <header
      className="px-6 py-3.5 flex items-center justify-between flex-shrink-0"
      style={{
        background: "#0F172A",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-xs w-full hidden md:block">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#4A6080" }} />
          <input
            placeholder="بحث..."
            className="w-full rounded-xl pr-10 pl-4 py-2.5 text-sm transition-all duration-200 focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "#F8FAFC",
              fontFamily: "Cairo, sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(212,163,115,0.4)";
              e.target.style.background = "rgba(255,255,255,0.06)";
              e.target.style.boxShadow = "0 0 0 3px rgba(212,163,115,0.08)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255,255,255,0.07)";
              e.target.style.background = "rgba(255,255,255,0.04)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#6B82A0",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color = "#F8FAFC";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLButtonElement).style.color = "#6B82A0";
          }}
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #C9975B, #E6B980)",
              color: "#1a1000",
            }}
          >
            3
          </span>
        </button>

        {/* User */}
        <div
          className="flex items-center gap-3 pr-3"
          style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #C9975B 0%, #D4A373 50%, #E6B980 100%)",
              boxShadow: "0 4px 12px rgba(212,163,115,0.25)",
              color: "#1a1000",
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-sm font-bold leading-tight" style={{ color: "#F8FAFC" }}>{user.name}</div>
            <div className="text-xs" style={{ color: "#4A6080" }}>{ROLE_LABELS[user.role]}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
