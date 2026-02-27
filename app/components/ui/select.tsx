import { type SelectHTMLAttributes, type ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export function Select({ children, className = "", ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 rounded-lg text-sm outline-none text-text-primary glass-input focus:border-[rgba(201,169,110,0.25)] transition-all duration-150 ${className}`}
    >
      {children}
    </select>
  );
}
