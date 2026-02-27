"use client";

import { useWorkers } from "@/lib/hooks";
import { ST, ACT } from "@/lib/constants/status";

interface PlannerFilterBarProps {
  filterWorker: string;
  onFilterWorkerChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterAct: string;
  onFilterActChange: (value: string) => void;
  onClear: () => void;
  hasFilter: boolean;
}

export function PlannerFilterBar({
  filterWorker,
  onFilterWorkerChange,
  filterStatus,
  onFilterStatusChange,
  filterAct,
  onFilterActChange,
  onClear,
  hasFilter,
}: PlannerFilterBarProps) {
  const { workers } = useWorkers();
  return (
    <div
      className="px-4 py-2 border-b flex items-center gap-3 flex-shrink-0"
      style={{
        borderColor: "var(--color-border-default)",
        backgroundColor: "var(--color-bg-base)",
      }}
    >
      <span
        className="text-[10px] uppercase tracking-wider"
        style={{ color: "var(--color-text-muted)" }}
      >
        Filter:
      </span>

      <select
        value={filterWorker}
        onChange={(e) => onFilterWorkerChange(e.target.value)}
        className="glass-input px-2 py-1 rounded text-xs outline-none"
      >
        <option value="all">All Workers</option>
        {workers.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => onFilterStatusChange(e.target.value)}
        className="glass-input px-2 py-1 rounded text-xs outline-none"
      >
        <option value="all">All Statuses</option>
        {Object.entries(ST).map(([k, v]) => (
          <option key={k} value={k}>
            {v.l}
          </option>
        ))}
      </select>

      <select
        value={filterAct}
        onChange={(e) => onFilterActChange(e.target.value)}
        className="glass-input px-2 py-1 rounded text-xs outline-none"
      >
        <option value="all">All Activities</option>
        {Object.entries(ACT).map(([k, v]) => (
          <option key={k} value={k}>
            {v.l}
          </option>
        ))}
      </select>

      {hasFilter && (
        <button
          onClick={onClear}
          className="text-[10px] px-2 py-1 rounded bg-white/10"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
