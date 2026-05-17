"use client";
import React from "react";
import { COLORS, SHADOWS } from "@/lib/design-system";
import { Star } from "lucide-react";

interface ReviewProps {
  author: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
  image?: string;
}

export function ReviewCard({
  author,
  role,
  content,
  rating,
  avatar,
  image,
}: ReviewProps) {
  return (
    <div
      className="p-8 rounded-2xl backdrop-blur-sm group hover:scale-105 transition-all duration-300"
      style={{
        background: "rgba(30, 41, 59, 0.8)",
        border: "1px solid rgba(212, 163, 115, 0.15)",
        boxShadow: SHADOWS.lg,
      }}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            style={{
              fill: i < rating ? COLORS.primary.gold : "rgba(212, 163, 115, 0.3)",
              color: i < rating ? COLORS.primary.gold : "rgba(212, 163, 115, 0.3)",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <p
        className="mb-6 text-lg leading-relaxed italic"
        style={{ color: COLORS.neutral.off_white }}
      >
        "{content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {avatar && (
          <img
            src={avatar}
            alt={author}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
        <div>
          <div
            className="font-bold"
            style={{ color: COLORS.neutral.off_white }}
          >
            {author}
          </div>
          <div style={{ color: COLORS.neutral.medium_gray }} className="text-sm">
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReviewsGridProps {
  reviews: ReviewProps[];
  columns?: 3;
}

export function ReviewsGrid({ reviews, columns = 3 }: ReviewsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review, idx) => (
        <ReviewCard key={idx} {...review} />
      ))}
    </div>
  );
}
