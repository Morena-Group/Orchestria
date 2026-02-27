"use client";

import type { PlanNode } from "@/lib/types";
import { PyramidNode } from "./pyramid-node";

interface ChildColProps {
  kid: PlanNode;
  idx: number;
  total: number;
  allNodes: PlanNode[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  expanded: Record<string, boolean>;
  onExpand: (id: string) => void;
  selectMode: boolean;
  selectedNodes: string[];
  onToggleSelect: (id: string) => void;
  filterDimmed: ((node: PlanNode) => boolean) | null;
  onAddChild?: (parentId: string) => void;
}

export function ChildCol({
  kid,
  idx,
  total,
  allNodes,
  selected,
  onSelect,
  expanded,
  onExpand,
  selectMode,
  selectedNodes,
  onToggleSelect,
  filterDimmed,
  onAddChild,
}: ChildColProps) {
  const isFirst = idx === 0;
  const isLast = idx === total - 1;
  const borderColor = "var(--color-border-default)";

  return (
    <div className="flex flex-col items-center relative" style={{ minWidth: 0 }}>
      {/* Horizontal connector segments */}
      <div className="relative w-full" style={{ height: 2 }}>
        {!isFirst && (
          <div
            className="absolute top-0 h-full"
            style={{ left: -6, right: "50%", backgroundColor: borderColor }}
          />
        )}
        {!isLast && (
          <div
            className="absolute top-0 h-full"
            style={{ left: "50%", right: -6, backgroundColor: borderColor }}
          />
        )}
      </div>
      {/* Vertical stub down to child node */}
      <div
        style={{
          width: 2,
          height: 14,
          backgroundColor: borderColor,
          flexShrink: 0,
        }}
      />
      <PyramidNode
        node={kid}
        allNodes={allNodes}
        selected={selected}
        onSelect={onSelect}
        expanded={expanded}
        onExpand={onExpand}
        selectMode={selectMode}
        selectedNodes={selectedNodes}
        onToggleSelect={onToggleSelect}
        filterDimmed={filterDimmed}
        onAddChild={onAddChild}
      />
    </div>
  );
}
