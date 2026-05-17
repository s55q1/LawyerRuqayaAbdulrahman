"use client";
import React from "react";
import { COLORS, BORDER_RADIUS, SHADOWS, TRANSITIONS } from "@/lib/design-system";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  fullWidth = false,
  disabled = false,
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : ""}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#C9975B] to-[#D4A373]
      text-[#1a1000] hover:shadow-lg
      focus:ring-offset-[#0F172A] focus:ring-[#D4A373]
    `,
    secondary: `
      bg-[#1E293B] text-[#F8FAFC]
      border border-[#334865] hover:border-[#D4A373]
      hover:bg-[#1E293B]/80 transition-all
    `,
    outline: `
      bg-transparent text-[#D4A373]
      border-2 border-[#D4A373] hover:bg-[#C9975B]/10
    `,
    ghost: `
      bg-transparent text-[#D4A373]
      hover:bg-[#C9975B]/20
    `,
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !isLoading && icon}
      {children}
    </button>
  );
}
