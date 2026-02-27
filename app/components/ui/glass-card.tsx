"use client";

import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = "", hover = true }: GlassCardProps) {
  return (
    <div
      className={`rounded-xl glass-card ${
        hover ? "hover:border-[rgba(201,169,110,0.15)] hover:shadow-[0_0_30px_rgba(201,169,110,0.04)] hover:-translate-y-px" : ""
      } transition-all duration-150 ${className}`}
    >
      {children}
    </div>
  );
}
