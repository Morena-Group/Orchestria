"use client";

import type { ReportBlock as ReportBlockType } from "@/lib/types";
import { GripVertical, X } from "lucide-react";
import { BlockContent } from "./block-content";
import { BLOCK_ICON_MAP } from "./briefings-view";

interface ReportBlockProps {
  block: ReportBlockType;
  onRemove: () => void;
}

export function ReportBlock({ block, onRemove }: ReportBlockProps) {
  const Icon = BLOCK_ICON_MAP[block.icon] ?? GripVertical;

  return (
    <div className="glass-card rounded-xl group">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-3 border-b"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <GripVertical
          size={14}
          style={{ color: "var(--color-text-muted)" }}
          className="cursor-grab"
        />
        <Icon size={14} style={{ color: "var(--color-accent)" }} />
        <span
          className="text-sm font-medium flex-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          {block.name}
        </span>
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={12} style={{ color: "var(--color-text-muted)" }} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <BlockContent blockId={block.id} />
      </div>
    </div>
  );
}
