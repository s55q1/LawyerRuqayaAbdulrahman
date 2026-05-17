"use client";
import React from "react";
import { COLORS, SHADOWS } from "@/lib/design-system";

interface StatBoxProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  description?: string;
}

export function StatBox({ icon, value, label, description }: StatBoxProps) {
  return (
    <div
      className="p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
      style={{
        background: "rgba(30, 41, 59, 0.6)",
        border: "1px solid rgba(212, 163, 115, 0.1)",
        boxShadow: SHADOWS.md,
      }}
    >
      <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all" style={{ background: "rgba(212, 163, 115, 0.1)" }}>
        <div style={{ color: COLORS.primary.gold_light, fontSize: "2rem" }}>
          {icon}
        </div>
      </div>

      <div
        className="text-4xl font-bold mb-2"
        style={{ color: COLORS.primary.gold_light }}
      >
        {value}
      </div>

      <div
        className="text-lg font-semibold mb-1"
        style={{ color: COLORS.neutral.off_white }}
      >
        {label}
      </div>

      {description && (
        <div
          className="text-sm"
          style={{ color: COLORS.neutral.medium_gray }}
        >
          {description}
        </div>
      )}
    </div>
  );
}

interface StatsGridProps {
  stats: StatBoxProps[];
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {stats.map((stat, idx) => (
        <StatBox key={idx} {...stat} />
      ))}
    </div>
  );
}
