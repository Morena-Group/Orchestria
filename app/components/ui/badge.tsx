import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: string;
  bg?: string;
  small?: boolean;
}

export function Badge({ children, color, bg, small }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
      }`}
      style={{
        color,
        backgroundColor: bg || (color ? `${color}20` : undefined),
      }}
    >
      {children}
    </span>
  );
}
