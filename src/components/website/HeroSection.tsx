"use client";
import React from "react";
import Link from "next/link";
import { COLORS, GRADIENTS } from "@/lib/design-system";

interface HeroSectionProps {
  badge?: {
    icon: React.ReactNode;
    text: string;
  };
  title: React.ReactNode;
  subtitle: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  secondaryCTA?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
  image?: {
    src: string;
    alt: string;
  };
  backgroundPattern?: boolean;
}

export default function HeroSection({
  badge,
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  backgroundPattern = true,
}: HeroSectionProps) {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        background: "var(--navy-900)", // الأبيض العاجي الدافئ
      }}

    >
      {/* Background Pattern */}
      {backgroundPattern && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle Gradient orbs */}
          <div
            className="absolute top-20 left-10 w-80 h-80 rounded-full opacity-5 blur-3xl"
            style={{ background: "#D4A373" }}
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-5 blur-3xl"
            style={{ background: "#0F172A" }}
          />

          {/* Grid circles (Light) */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{
              border: "1px solid rgba(15, 23, 42, 0.03)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none"
            style={{
              border: "1px solid rgba(15, 23, 42, 0.015)",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            {badge && (
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-sm font-semibold animate-fade-in"
                style={{
                  background: "rgba(212, 163, 115, 0.1)",
                  border: "1px solid rgba(212, 163, 115, 0.3)",
                  color: "#A0703C", // ذهبي أغمق للوضوح على خلفية فاتحة
                }}
              >
                {badge.icon}
                {badge.text}
              </div>
            )}

            {/* Main Title */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up"
              style={{ color: "#0F172A" }} // كحلي داكن جداً للعناوين
            >
              {typeof title === "string" ? title : title}
            </h1>

            {/* Subtitle Accent */}
            <div
              className="w-12 h-1.5 rounded-full mb-6"
              style={{ background: "linear-gradient(135deg, #C9975B 0%, #D4A373 100%)" }}
            />

            {/* Description */}
            <p
              className="text-lg leading-relaxed mb-8 max-w-lg animate-fade-in-up"
              style={{ color: "#475569" }} // رمادي فحمي متوسط للنصوص
            >
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <Link href={primaryCTA.href}>
                <button
                  className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:shadow-lg hover:translate-y-[-2px]"
                  style={{
                    background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                    color: "#FFFFFF",
                  }}
                >
                  {primaryCTA.icon}
                  {primaryCTA.text}
                </button>
              </Link>

              {secondaryCTA && (
                <Link href={secondaryCTA.href}>
                  <button
                    className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 border-2 transition-all hover:bg-slate-50 hover:translate-y-[-2px]"
                    style={{
                      borderColor: "#D4A373",
                      color: "#A0703C",
                      background: "transparent",
                    }}
                  >
                    {secondaryCTA.icon}
                    {secondaryCTA.text}
                  </button>
                </Link>
              )}
            </div>

            {/* Trust indicators */}
            <div
              className="flex gap-8 mt-12 pt-8 border-t"
              style={{
                borderColor: "rgba(15, 23, 42, 0.05)",
              }}
            >
              <div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: "#0F172A" }}
                >
                  15+
                </div>
                <div style={{ color: "#64748B" }} className="text-sm font-semibold">
                  سنة خبرة
                </div>
              </div>
              <div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: "#0F172A" }}
                >
                  500+
                </div>
                <div style={{ color: "#64748B" }} className="text-sm font-semibold">
                  قضية ناجحة
                </div>
              </div>
            </div>
          </div>

          {/* Visual (Image or Graphic) */}
          {image && (
            <div className="order-1 lg:order-2 animate-fade-in">
              <div
                className="relative w-full aspect-square rounded-2xl overflow-hidden"
                style={{
                  border: "1px solid rgba(212, 163, 115, 0.2)",
                  background: "#FFFFFF",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05)",
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div
          className="w-8 h-12 rounded-full border-2 flex items-start justify-center pt-2"
          style={{
            borderColor: "rgba(15, 23, 42, 0.1)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#D4A373",
            }}
          />
        </div>
      </div>
    </section>
  );
}
