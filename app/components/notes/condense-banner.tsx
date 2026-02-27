"use client";

import { WORKERS } from "@/lib/data/workers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

export function CondenseBanner() {
  return (
    <div
      className="mb-6 p-4 rounded-xl border"
      style={{
        backgroundColor: "rgba(201, 169, 110, 0.06)",
        borderColor: "rgba(201, 169, 110, 0.25)",
      }}
    >
      <p
        className="text-xs mb-3"
        style={{ color: "var(--color-text-secondary)" }}
      >
        AI will group notes by theme. Pinned notes won&apos;t be affected.
      </p>
      <div className="flex items-center gap-3">
        <Label>Worker:</Label>
        <select
          className="glass-input px-2 py-1 rounded text-xs outline-none"
        >
          {WORKERS.map((w) => (
            <option key={w.id}>{w.name}</option>
          ))}
        </select>
        <Button primary>
          <Sparkles size={14} /> Preview
        </Button>
        <span
          className="text-[10px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          Revert anytime.
        </span>
      </div>
    </div>
  );
}
