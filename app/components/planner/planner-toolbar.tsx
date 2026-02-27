"use client";

import type { Plan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Filter,
  Check,
  CheckCircle2,
  RotateCcw,
  Save,
  MessageSquare,
  Download,
  Zap,
} from "lucide-react";
import { VersionsDropdown } from "./versions-dropdown";

interface PlannerToolbarProps {
  plans: Plan[];
  activePlan: string;
  onActivePlanChange: (planId: string) => void;
  nodeCount: number;
  showTemplates: boolean;
  onToggleTemplates: () => void;
  showFilter: boolean;
  onToggleFilter: () => void;
  hasFilter: boolean;
  selectMode: boolean;
  onToggleSelectMode: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  showVersions: boolean;
  onToggleVersions: () => void;
  showChat: boolean;
  onToggleChat: () => void;
}

export function PlannerToolbar({
  plans,
  activePlan,
  onActivePlanChange,
  nodeCount,
  showTemplates,
  onToggleTemplates,
  showFilter,
  onToggleFilter,
  hasFilter,
  selectMode,
  onToggleSelectMode,
  zoom,
  onZoomIn,
  onZoomOut,
  showVersions,
  onToggleVersions,
  showChat,
  onToggleChat,
}: PlannerToolbarProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
      style={{ borderColor: "var(--color-border-default)" }}
    >
      {/* Left: plan selector + node count */}
      <div className="flex items-center gap-2">
        <select
          value={activePlan}
          onChange={(e) => onActivePlanChange(e.target.value)}
          className="glass-input px-3 py-1.5 rounded-lg text-sm font-semibold outline-none"
        >
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
          <option value="new">+ New Plan...</option>
        </select>
        <span
          className="text-[10px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {nodeCount} nodes
        </span>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-1.5">
        <Button onClick={onToggleTemplates}>
          <Layers size={12} /> Templates
        </Button>

        <Button onClick={onToggleFilter}>
          <Filter size={12} /> Filter
          {hasFilter && (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
          )}
        </Button>

        <Button onClick={onToggleSelectMode}>
          {selectMode ? (
            <>
              <Check size={12} /> Done
            </>
          ) : (
            <>
              <CheckCircle2 size={12} /> Select
            </>
          )}
        </Button>

        {/* Zoom controls */}
        <div
          className="flex items-center gap-0.5 rounded-lg border px-1.5 py-1"
          style={{ borderColor: "var(--color-border-default)" }}
        >
          <button
            onClick={onZoomOut}
            className="text-xs px-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            −
          </button>
          <span
            className="text-[10px] w-8 text-center"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="text-xs px-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            +
          </button>
        </div>

        <Button onClick={() => console.log("Undo")}>
          <RotateCcw size={12} /> Undo
        </Button>

        {/* Versions with dropdown */}
        <div className="relative">
          <Button onClick={onToggleVersions}>
            <Save size={12} /> Versions
          </Button>
          <VersionsDropdown open={showVersions} />
        </div>

        <Button onClick={onToggleChat}>
          <MessageSquare size={12} /> Chat
        </Button>

        <Button onClick={() => console.log("Export plan")}>
          <Download size={12} /> Export
        </Button>

        <Button primary onClick={() => console.log("Launch plan")}>
          <Zap size={14} /> Launch
        </Button>
      </div>
    </div>
  );
}
