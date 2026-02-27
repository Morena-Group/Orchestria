import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg text-sm outline-none text-text-primary placeholder:text-text-muted glass-input focus:border-[rgba(201,169,110,0.25)] focus:shadow-[0_0_20px_rgba(201,169,110,0.05)] transition-all duration-150 ${className}`}
    />
  );
}
