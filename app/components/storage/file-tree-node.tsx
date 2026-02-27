"use client";

import { type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FileTreeNodeProps {
  label: string;
  count?: number;
  depth: number;
  expanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
  icon?: ReactNode;
}

export function FileTreeNode({ label, count, depth, expanded, onToggle, children, icon }: FileTreeNodeProps) {
  const hasChildren = !!children;

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs hover:bg-white/[0.02] transition-colors"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown size={12} style={{ color: "var(--color-text-muted)" }} className="flex-shrink-0" />
          ) : (
            <ChevronRight size={12} style={{ color: "var(--color-text-muted)" }} className="flex-shrink-0" />
          )
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span
          className="truncate"
          style={{
            color: depth === 0 ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            fontWeight: depth === 0 ? 600 : 400,
          }}
        >
          {label}
        </span>
        {count !== undefined && (
          <span className="text-[10px] ml-auto flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>
            ({count})
          </span>
        )}
      </button>
      {expanded && children && (
        <div>{children}</div>
      )}
    </div>
  );
}
