import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export const CASE_TYPE_LABELS: Record<string, string> = {
  LABOR: "قضايا عمالية",
  PERSONAL_STATUS: "أحوال شخصية",
  COMMERCIAL: "قضايا تجارية",
  EXECUTION: "تنفيذ",
  CONSULTATION: "استشارات",
  OTHER: "أخرى",
};

export const CASE_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "نشطة",
  CLOSED: "مغلقة",
  SUSPENDED: "موقوفة",
  WON: "مكسوبة",
  LOST: "مخسورة",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "معلقة",
  PARTIAL: "جزئية",
  PAID: "مدفوعة",
  OVERDUE: "متأخرة",
};
