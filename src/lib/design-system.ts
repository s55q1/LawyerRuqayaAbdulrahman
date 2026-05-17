/**
 * Design System - نظام التصميم الاحترافي الموحد
 * للتأكد من تناسق واحترافية الموقع
 */

export const COLORS = {
  // Primary - الألوان الأساسية
  primary: {
    dark: "#0B1325",      // كحلي ليلي عميق (بدل الأسود)
    navy: "#0B1325",      // كحلي عميق
    gold: "#C5A059",      // ذهبي شامبين مطفي
    gold_light: "#D4A373",// ذهبي فاتح
    gold_lighter: "#E6B980", // ذهبي أفتح
  },

  // Neutrals - المحايد الفاخر
  neutral: {
    white: "#FFFFFF",
    off_white: "#FAF8F5", // أبيض عاجي دافئ
    light_gray: "#F1EFEA", // رمادي دافئ فاتح
    medium_gray: "#94A3B8",
    dark_gray: "#4A5568",
    darker_gray: "#1A202C",
  },

  // Backgrounds - خلفيات (تم قلبها لتصبح فاتحة)
  background: {
    primary: "#FAF8F5",   // عاجي دافئ (الأساسية)
    secondary: "#F1EFEA", // ثانوية دافئة
    card: "#FFFFFF",      // البطاقات بيضاء نظيفة
    dark: "#0B1325",      // الداكنة (تستخدم للـ Sidebar فقط)
  },

  // Semantic - دلالية
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};


export const TYPOGRAPHY = {
  // العناوين الرئيسية
  heading: {
    h1: { size: "4.5rem", weight: 700, lineHeight: 1.1 },     // 72px
    h2: { size: "3.75rem", weight: 700, lineHeight: 1.2 },    // 60px
    h3: { size: "2.25rem", weight: 600, lineHeight: 1.3 },    // 36px
    h4: { size: "1.875rem", weight: 600, lineHeight: 1.4 },   // 30px
  },

  // النصوص الأساسية
  body: {
    lg: { size: "1.125rem", weight: 400, lineHeight: 1.7 },   // 18px
    base: { size: "1rem", weight: 400, lineHeight: 1.6 },     // 16px
    sm: { size: "0.875rem", weight: 400, lineHeight: 1.6 },   // 14px
    xs: { size: "0.75rem", weight: 400, lineHeight: 1.5 },    // 12px
  },

  // الأوزان
  weight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export const SPACING = {
  // القياسات الموحدة
  xs: "0.5rem",   // 8px
  sm: "1rem",     // 16px
  md: "1.5rem",   // 24px
  lg: "2rem",     // 32px
  xl: "3rem",     // 48px
  "2xl": "4rem",  // 64px
  "3xl": "6rem",  // 96px
};

export const SHADOWS = {
  // الظلال الفاخمة
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.15)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.2)",
  gold: "0 4px 20px rgba(201, 151, 91, 0.15)",
  gold_lg: "0 10px 30px rgba(201, 151, 91, 0.2)",
};

export const BORDER_RADIUS = {
  sm: "0.5rem",   // 8px
  md: "1rem",     // 16px
  lg: "1.5rem",   // 24px
  full: "9999px",
};

export const TRANSITIONS = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  slower: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
};

// Gradient Presets - تدرجات جاهزة
export const GRADIENTS = {
  goldDark: "linear-gradient(135deg, #C5A059 0%, #D4A373 50%, #E6B980 100%)",
  darkBlue: "linear-gradient(145deg, #0B1325 0%, #1A2847 50%, #070D18 100%)",
  subtleGold: "linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(212, 163, 115, 0.05) 100%)",
  premium: "linear-gradient(135deg, #FAF8F5 0%, #F1EFEA 50%, #FFFFFF 100%)", // تدرج فاتح فاخر
};


/**
 * Utilities للاستخدام السريع
 */
export const getTypographyStyle = (type: keyof typeof TYPOGRAPHY, subtype: string) => {
  const category = TYPOGRAPHY[type as keyof typeof TYPOGRAPHY] as any;
  const style = category[subtype];
  return {
    fontSize: style.size,
    fontWeight: style.weight,
    lineHeight: style.lineHeight,
  };
};

/**
 * Class utilities للـ Tailwind
 */
export const classNames = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};
