import { type ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
}

export function Label({ children }: LabelProps) {
  return (
    <span className="text-xs block mb-1 text-text-muted">{children}</span>
  );
}
