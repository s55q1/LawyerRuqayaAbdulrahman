"use client";
import React from "react";
import Link from "next/link";
import { COLORS, SHADOWS, GRADIENTS } from "@/lib/design-system";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features?: string[];
  href?: string;
  image?: string;
}

export function ServiceCard({
  icon,
  title,
  description,
  features,
  href = "#",
  image,
}: ServiceCardProps) {
  return (
    <Link href={href}>
      <div
        className="group h-full p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 overflow-hidden relative"
        style={{
          background: "rgba(30, 41, 59, 0.6)",
          border: "1px solid rgba(212, 163, 115, 0.1)",
          boxShadow: SHADOWS.md,
        }}
      >
        {/* Background accent */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
          style={{
            background: GRADIENTS.subtleGold,
          }}
        />

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(201, 151, 91, 0.15), rgba(212, 163, 115, 0.1))",
            border: "1px solid rgba(212, 163, 115, 0.2)",
            fontSize: "2rem",
            color: COLORS.primary.gold_light,
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <h3
          className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all"
          style={{
            color: COLORS.neutral.off_white,
            background: GRADIENTS.goldDark,
          }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="mb-6"
          style={{ color: COLORS.neutral.medium_gray }}
        >
          {description}
        </p>

        {/* Features */}
        {features && features.length > 0 && (
          <ul className="space-y-2 mb-6">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span
                  style={{ color: COLORS.primary.gold_light }}
                  className="font-bold mt-0.5"
                >
                  ✓
                </span>
                <span style={{ color: COLORS.neutral.medium_gray }}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Learn more link */}
        <div
          className="flex items-center gap-2 font-semibold group-hover:gap-4 transition-all"
          style={{ color: COLORS.primary.gold_light }}
        >
          اعرف أكثر →
        </div>
      </div>
    </Link>
  );
}

interface ServicesGridProps {
  services: ServiceCardProps[];
  columns?: 3 | 4;
}

export function ServicesGrid({ services, columns = 3 }: ServicesGridProps) {
  const gridCols = columns === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {services.map((service, idx) => (
        <ServiceCard key={idx} {...service} />
      ))}
    </div>
  );
}
