"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  primary?: boolean;
}

export function Button({ children, primary, className = "", ...props }: ButtonProps) {
  if (primary) {
    return (
      <button
        {...props}
        className={`btn-primary-gradient px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-accent-fg transition-all duration-150 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      {...props}
      className={`glass-input px-4 py-2 rounded-lg text-sm flex items-center gap-2 text-text-secondary hover:bg-glass-hover hover:border-[rgba(200,169,110,0.15)] transition-all duration-150 ${className}`}
    >
      {children}
    </button>
  );
}
