import React from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export default function PageHero({ title, subtitle, breadcrumb, children }: PageHeroProps) {
  return (
    <section
      className="relative text-white overflow-hidden"
      style={{
        minHeight: "320px",
        background: "linear-gradient(135deg, #040812 0%, #0B1325 55%, #112040 100%)",
      }}
    >
      {/* Gold grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#C5A059 1px, transparent 1px), linear-gradient(90deg, #C5A059 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow top-right */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }}
      />
      {/* Glow bottom-left */}
      <div
        className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }}
      />
      {/* Gold top line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent" />
      {/* Gold bottom line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-5 font-arabic">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-600">/</span>}
                <span className={i === breadcrumb.length - 1 ? "text-[#C5A059]" : ""}>{crumb.label}</span>
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-arabic leading-tight">
          {title}
        </h1>

        {/* Gold divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-px bg-[#C5A059]/40" />
          <div className="w-2 h-2 rotate-45 bg-[#C5A059]" />
          <div className="w-10 h-px bg-[#C5A059]/40" />
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-slate-300 text-base max-w-xl mx-auto font-arabic leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Extra content (buttons etc.) */}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
