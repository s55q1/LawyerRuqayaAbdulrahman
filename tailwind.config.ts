import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "var(--navy-950)",
          900: "var(--navy-900)",
          850: "var(--navy-850)",
          800: "var(--navy-800)",
          750: "var(--navy-750)",
          700: "var(--navy-700)",
          600: "var(--navy-600)",
          500: "var(--navy-500)",
          400: "var(--navy-400)",
          300: "var(--navy-300)",
          200: "var(--navy-200)",
          100: "var(--navy-100)",
          50:  "var(--navy-50)",
        },
        gold: {
          900: "var(--gold-900)",
          800: "var(--gold-800)",
          700: "var(--gold-700)",
          600: "var(--gold-600)",
          500: "var(--gold-500)",
          400: "var(--gold-400)",
          300: "var(--gold-300)",
          200: "var(--gold-200)",
          100: "var(--gold-100)",
          50:  "var(--gold-50)",
        },
      },

      fontFamily: {
        arabic: ["Cairo", "Noto Kufi Arabic", "sans-serif"],
      },
      animation: {
        "fade-up":      "fadeUp 0.5s ease-out both",
        "fade-in":      "fadeIn 0.4s ease-out both",
        "slide-right":  "slideRight 0.5s ease-out both",
        "scale-in":     "scaleIn 0.35s ease-out both",
        "float":        "float 3s ease-in-out infinite",
        "pulse-gold":   "pulseGold 2s infinite",
        "shimmer":      "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeUp:     { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn:     { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideRight: { "0%": { opacity: "0", transform: "translateX(-16px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        scaleIn:    { "0%": { opacity: "0", transform: "scale(0.95)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        float:      { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        pulseGold:  { "0%, 100%": { boxShadow: "0 0 0 0 rgba(212,163,115,0.35)" }, "50%": { boxShadow: "0 0 0 8px rgba(212,163,115,0)" } },
        shimmer:    { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      backgroundImage: {
        "hero-pattern":   "linear-gradient(145deg, #070D18 0%, #0F172A 40%, #1A2744 70%, #0F172A 100%)",
        "gold-gradient":  "linear-gradient(135deg, #C9975B 0%, #D4A373 50%, #E6B980 100%)",
        "card-gradient":  "linear-gradient(145deg, #1E293B 0%, #243044 100%)",
        "surface-subtle": "linear-gradient(180deg, #1E293B 0%, #1A2535 100%)",
      },
      boxShadow: {
        "card":       "0 2px 10px rgba(0,0,0,0.35)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.5)",
        "gold":       "0 4px 24px rgba(212,163,115,0.25)",
        "gold-lg":    "0 8px 40px rgba(212,163,115,0.35)",
        "navy":       "0 4px 24px rgba(15,23,42,0.6)",
        "inner-gold": "inset 0 1px 0 rgba(212,163,115,0.15)",
        "glow":       "0 0 20px rgba(212,163,115,0.3), 0 0 60px rgba(212,163,115,0.1)",
      },
      borderColor: {
        DEFAULT: "rgba(255,255,255,0.07)",
        "gold":   "rgba(212,163,115,0.25)",
        "bright": "rgba(255,255,255,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
