import { Plus, type LucideIcon } from "lucide-react";
import { Button } from "./button";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  action?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, desc, action, onAction, children }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-accent-dim"
        >
          <Icon size={28} className="text-accent" />
        </div>
        <h3 className="text-base font-semibold mb-2 text-text-primary">{title}</h3>
        <p className="text-sm mb-5 leading-relaxed text-text-secondary">{desc}</p>
        {action && (
          <Button primary onClick={onAction}>
            <Plus size={14} /> {action}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
