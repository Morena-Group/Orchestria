"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PROVIDERS = [
  { n: "Anthropic", k: "sk-ant-***", s: true },
  { n: "Google", k: "AIza***", s: true },
  { n: "OpenAI", k: "sk-proj-***", s: true },
  { n: "Moonshot", k: "", s: false },
];

export function ApiKeysTab() {
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        API Keys & Providers
      </h2>
      {PROVIDERS.map((p) => (
        <div
          key={p.n}
          className="p-4 rounded-xl border"
          style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{p.n}</span>
            <Badge color={p.s ? "var(--color-text-primary)" : "var(--color-text-secondary)"}>
              {p.s ? "Active" : "Not Set"}
            </Badge>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={p.k}
              readOnly
              className="glass-input flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
              placeholder="Enter API key..."
            />
            <Button>{p.k ? "Rotate" : "Add"}</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
