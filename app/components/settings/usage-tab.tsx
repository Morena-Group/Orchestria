"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TOKEN_USAGE = [
  { model: "Claude 3.5 Sonnet", provider: "Anthropic", input: 1_240_000, output: 380_000, cost: "$18.60" },
  { model: "Gemini 1.5 Pro", provider: "Google", input: 860_000, output: 210_000, cost: "$8.40" },
  { model: "GPT-4o", provider: "OpenAI", input: 420_000, output: 95_000, cost: "$6.20" },
];

const totalCost = "$33.20";

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
              Pro Plan
            </span>
            <Badge color="var(--color-accent)">Active</Badge>
          </div>
          <Button>Upgrade</Button>
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          Unlimited projects &bull; 5 workers &bull; 50K context tokens &bull; All plugins
        </p>
      </div>

      {/* Token Usage Table */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
          Token Usage (This Month)
        </h3>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--color-border-default)" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-2 text-[9px] uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)", backgroundColor: "var(--color-bg-card)" }}
          >
            <span className="flex-1">Model</span>
            <span className="w-24 text-right">Input Tokens</span>
            <span className="w-24 text-right">Output Tokens</span>
            <span className="w-20 text-right">Est. Cost</span>
          </div>

          {/* Rows */}
          {TOKEN_USAGE.map((row) => (
            <div
              key={row.model}
              className="flex items-center gap-3 px-4 py-3 border-t"
              style={{ borderColor: "var(--color-border-default)" }}
            >
              <div className="flex-1">
                <span className="text-xs block" style={{ color: "var(--color-text-primary)" }}>{row.model}</span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{row.provider}</span>
              </div>
              <span className="w-24 text-right text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {row.input.toLocaleString()}
              </span>
              <span className="w-24 text-right text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {row.output.toLocaleString()}
              </span>
              <span className="w-20 text-right text-xs font-medium" style={{ color: "var(--color-accent)" }}>
                {row.cost}
              </span>
            </div>
          ))}

          {/* Total */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-t"
            style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}
          >
            <span className="flex-1 text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Total
            </span>
            <span className="w-24 text-right text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {(1_240_000 + 860_000 + 420_000).toLocaleString()}
            </span>
            <span className="w-24 text-right text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {(380_000 + 210_000 + 95_000).toLocaleString()}
            </span>
            <span className="w-20 text-right text-xs font-bold" style={{ color: "var(--color-accent)" }}>
              {totalCost}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
