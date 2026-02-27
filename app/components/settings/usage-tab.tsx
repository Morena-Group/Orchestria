"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

export function UsageTab() {
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        Usage & Billing
      </h2>

      {/* Current Plan */}
      <div
        className="p-4 rounded-xl border"
        style={{ borderColor: "var(--color-accent)", backgroundColor: "rgba(201, 169, 110, 0.04)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Free Plan
            </span>
            <Badge color="var(--color-accent)">Active</Badge>
          </div>
          <Button>Upgrade</Button>
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          1 project &bull; 2 workers &bull; 8K context tokens
        </p>
      </div>

      {/* Token Usage — empty state */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
          Token Usage (This Month)
        </h3>
        <div className="py-8 text-center rounded-xl border" style={{ borderColor: "var(--color-border-default)" }}>
          <BarChart3 size={24} className="mx-auto mb-2" style={{ color: "var(--color-text-muted)" }} />
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            No usage data yet. Token tracking starts when AI workers process tasks.
          </p>
        </div>
      </div>
    </div>
  );
}
