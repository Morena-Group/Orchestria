"use client";

import { useWorkers } from "@/lib/hooks";
import { ST, ACT } from "@/lib/constants/status";
import { Trash2, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClose: () => void;
  onBulkAction?: (action: string, value: string) => void;
}

export function BulkActionBar({ selectedCount, onClose, onBulkAction }: BulkActionBarProps) {
  const { workers } = useWorkers();
  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-xl border z-30"
      style={{
        backgroundColor: "var(--color-bg-deep)",
        borderColor: "var(--color-accent)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
      }}
    >
      <span
        className="text-xs font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {selectedCount} selected
      </span>

      <select
        className="glass-input px-2 py-1 rounded text-xs outline-none"
        onChange={(e) => {
          if (e.target.value) onBulkAction?.("worker", e.target.value);
          e.target.value = "";
        }}
      >
        <option value="">Set Worker...</option>
        {workers.map((w) => (
          <option key={w.id} value={w.id}>{w.name}</option>
        ))}
      </select>

      <select
        className="glass-input px-2 py-1 rounded text-xs outline-none"
        onChange={(e) => {
          if (e.target.value) onBulkAction?.("status", e.target.value);
          e.target.value = "";
        }}
      >
        <option value="">Set Status...</option>
        {Object.entries(ST).map(([k, v]) => (
          <option key={k} value={k}>{v.l}</option>
        ))}
      </select>

      <select
        className="glass-input px-2 py-1 rounded text-xs outline-none"
        onChange={(e) => {
          if (e.target.value) onBulkAction?.("activity", e.target.value);
          e.target.value = "";
        }}
      >
        <option value="">Set Activity...</option>
        {Object.entries(ACT).map(([k, v]) => (
          <option key={k} value={k}>{v.l}</option>
        ))}
      </select>

      <button
        onClick={() => onBulkAction?.("delete", "")}
        className="p-1.5 rounded hover:bg-white/5"
        title="Delete selected"
      >
        <Trash2 size={14} style={{ color: "var(--color-error)" }} />
      </button>

      <button onClick={onClose} className="p-1.5 rounded hover:bg-white/5">
        <X size={14} style={{ color: "var(--color-text-secondary)" }} />
      </button>
    </div>
  );
}
