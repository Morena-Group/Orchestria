"use client";

import type { PlanNode } from "@/lib/types";
import { ST, PRI, ACT } from "@/lib/constants/status";
import { useWorkers } from "@/lib/hooks";
import { getProgress } from "@/lib/utils/planner";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight, Plus, Edit3 } from "lucide-react";
import { ChildCol } from "./child-col";

interface PyramidNodeProps {
  node: PlanNode;
  allNodes: PlanNode[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  expanded: Record<string, boolean>;
  onExpand: (id: string) => void;
  selectMode: boolean;
  selectedNodes: string[];
  onToggleSelect: (id: string) => void;
  filterDimmed: ((node: PlanNode) => boolean) | null;
}

export function PyramidNode({
  node,
  allNodes,
  selected,
  onSelect,
  expanded,
  onExpand,
  selectMode,
  selectedNodes,
  onToggleSelect,
  filterDimmed,
}: PyramidNodeProps) {
  const { workers } = useWorkers();
  const w = workers.find((x) => x.id === node.worker);
  const sc = ST[node.status] ?? ST.draft;
  const ac = node.act ? ACT[node.act] : null;
  const isSel = selected === node.id;
  const hasKids = node.children.length > 0;
  const isExp = expanded[node.id];
  const kids = allNodes.filter((n) => node.children.includes(n.id));
  const progress = hasKids ? getProgress(node, allNodes) : null;
  const dimmed = filterDimmed ? !filterDimmed(node) : false;
  const isChecked = selectedNodes.includes(node.id);

  // Visual sizing by level
  const minW = node.level === 0 ? 280 : node.level === 1 ? 250 : node.level === 2 ? 220 : 200;
  const borderW = node.level === 0 ? 2 : 1;
  const actColor = ac ? ac.c : sc.c;
  const borderColor = "var(--color-border-default)";

  return (
    <div className="flex flex-col items-center">
      {/* Node card */}
      <div
        className="rounded-xl cursor-pointer group relative transition-all"
        style={{
          borderWidth: borderW,
          borderStyle: "solid",
          borderColor: actColor,
          backgroundColor: `${actColor}08`,
          minWidth: minW,
          maxWidth: minW + 60,
          opacity: dimmed ? 0.3 : 1,
          boxShadow: isSel ? `0 0 0 2px var(--color-accent)` : "none",
        }}
        onClick={() =>
          selectMode
            ? onToggleSelect(node.id)
            : onSelect(isSel ? null : node.id)
        }
      >
        {/* Activity color strip */}
        {ac && (
          <div
            className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
            style={{ backgroundColor: ac.c }}
          />
        )}

        <div className="px-3 py-2" style={{ paddingLeft: ac ? 14 : 12 }}>
          {/* Top row: expand + priority + label */}
          <div className="flex items-center gap-1.5 mb-1">
            {selectMode && (
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleSelect(node.id)}
                className="accent-[#c9a96e]"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {!selectMode && hasKids && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand(node.id);
                }}
                className="p-0.5 rounded hover:bg-white/5"
              >
                {isExp ? (
                  <ChevronDown size={12} style={{ color: actColor }} />
                ) : (
                  <ChevronRight size={12} style={{ color: actColor }} />
                )}
              </button>
            )}
            <span
              className={`font-semibold flex-1 truncate ${
                node.level === 0 ? "text-sm" : "text-xs"
              }`}
              style={{ color: "var(--color-text-primary)" }}
            >
              {node.label}
            </span>
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge color={sc.c} bg={sc.bg} small>
              {sc.l}
            </Badge>
            {ac && (
              <Badge color={ac.c} bg={ac.bg} small>
                {ac.l}
              </Badge>
            )}
            {w && (
              <div className="flex items-center gap-1">
                <Avatar type={w.type} size={14} role={w.role} />
                <span
                  className="text-[10px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {w.name}
                </span>
              </div>
            )}
            {!w && node.level > 0 && (
              <span
                className="text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                Unassigned
              </span>
            )}
          </div>

          {/* Progress bar for parents */}
          {progress !== null && (
            <div className="mt-1.5 flex items-center gap-2">
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--color-bg-deep)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor:
                      progress === 100 ? "var(--color-accent)" : actColor,
                  }}
                />
              </div>
              <span
                className="text-[9px] w-7 text-right"
                style={{ color: "var(--color-text-muted)" }}
              >
                {progress}%
              </span>
            </div>
          )}
        </div>

        {/* Hover actions */}
        {!selectMode && (
          <div className="absolute -top-2 -right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 z-20">
            <button
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-fg)",
              }}
              title="Add child"
            >
              <Plus size={10} />
            </button>
            <button
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#71717a", color: "#ffffff" }}
              title="Edit"
            >
              <Edit3 size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Tree connectors + children */}
      {hasKids && isExp && (
        <>
          {/* Vertical line down from parent */}
          <div
            style={{
              width: 2,
              height: 16,
              backgroundColor: borderColor,
              flexShrink: 0,
            }}
          />
          {kids.length === 1 ? (
            <PyramidNode
              node={kids[0]}
              allNodes={allNodes}
              selected={selected}
              onSelect={onSelect}
              expanded={expanded}
              onExpand={onExpand}
              selectMode={selectMode}
              selectedNodes={selectedNodes}
              onToggleSelect={onToggleSelect}
              filterDimmed={filterDimmed}
            />
          ) : (
            <div className="flex items-start gap-3">
              {kids.map((kid, idx) => (
                <ChildCol
                  key={kid.id}
                  kid={kid}
                  idx={idx}
                  total={kids.length}
                  allNodes={allNodes}
                  selected={selected}
                  onSelect={onSelect}
                  expanded={expanded}
                  onExpand={onExpand}
                  selectMode={selectMode}
                  selectedNodes={selectedNodes}
                  onToggleSelect={onToggleSelect}
                  filterDimmed={filterDimmed}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
