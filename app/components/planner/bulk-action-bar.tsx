"use client";

import { WORKERS } from "@/lib/data/workers";
import { ST, ACT } from "@/lib/constants/status";
import { Trash2, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClose: () => void;
}

export function BulkActionBar({ selectedCount, onClose }: BulkActionBarProps) {
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
      >
        <option>Set Worker...</option>
        {WORKERS.map((w) => (
          <option key={w.id}>{w.name}</option>
        ))}
      </select>

      <select
        className="glass-input px-2 py-1 rounded text-xs outline-none"
      >
        <option>Set Status...</option>
        {Object.entries(ST).map(([k, v]) => (
          <option key={k}>{v.l}</option>
        ))}
      </select>

      <select
        className="glass-input px-2 py-1 rounded text-xs outline-none"
      >
        <option>Set Activity...</option>
        {Object.entries(ACT).map(([k, v]) => (
          <option key={k}>{v.l}</option>
        ))}
      </select>

      <button
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
