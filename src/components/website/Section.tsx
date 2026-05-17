"use client";
import React from "react";
import { COLORS, GRADIENTS } from "@/lib/design-system";

interface SectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  variant?: "light" | "dark" | "gradient";
  centered?: boolean;
  className?: string;
}

export default function Section({
  title,
  subtitle,
  description,
  children,
  variant = "dark",
  centered = false,
  className = "",
}: SectionProps) {
  const bgStyles = {
    light: "#F8FAFC",
    dark: "#0F172A",
    gradient: GRADIENTS.darkBlue,
  };

  const textColors = {
    light: "#0F172A",
    dark: "#F8FAFC",
    gradient: "#F8FAFC",
  };

  return (
    <section
      className={`py-20 px-6 ${className}`}
      style={{
        background: bgStyles[variant],
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || subtitle || description) && (
          <div className={`mb-16 ${centered ? "text-center max-w-3xl mx-auto" : ""}`}>
            {subtitle && (
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-sm font-semibold"
                style={{
                  background:
                    variant === "light"
                      ? "rgba(201, 151, 91, 0.1)"
                      : "rgba(212, 163, 115, 0.08)",
                  color: COLORS.primary.gold_light,
                  border:
                    variant === "light"
                      ? "1px solid rgba(201, 151, 91, 0.2)"
                      : "1px solid rgba(212, 163, 115, 0.2)",
                }}
              >
                {subtitle}
              </div>
            )}

            {title && (
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: textColors[variant] }}
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                className="text-lg leading-relaxed"
                style={{
                  color:
                    variant === "light"
                      ? COLORS.neutral.dark_gray
                      : COLORS.neutral.medium_gray,
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </section>
  );
}
