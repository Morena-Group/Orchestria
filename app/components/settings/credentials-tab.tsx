"use client";

import { Badge } from "@/components/ui/badge";
import { Plus, Shield } from "lucide-react";

const TIERS = [
  { t: "Open", c: "var(--color-text-primary)", d: "Worker reads directly. For non-sensitive config.", i: "\uD83D\uDFE2" },
  { t: "Gated", c: "var(--color-accent)", d: "Requires your approval per use. Default.", i: "\uD83D\uDFE1" },
  { t: "Ephemeral", c: "var(--color-error)", d: "Subagent uses it and discards. Never enters context.", i: "\uD83D\uDD34" },
];

export function CredentialsTab() {
  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        Credentials Vault
      </h2>
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Manage secrets agents may need. Three access tiers control how workers interact with each credential.
      </p>

      {/* Tier cards */}
      <div className="grid grid-cols-3 gap-3">
        {TIERS.map((tier) => (
          <div key={tier.t} className="p-3 rounded-xl border" style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}>
            <div className="flex items-center gap-2 mb-1">
              <span>{tier.i}</span>
              <span className="text-sm font-semibold" style={{ color: tier.c }}>{tier.t}</span>
            </div>
            <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{tier.d}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="py-8 text-center rounded-xl border" style={{ borderColor: "var(--color-border-default)" }}>
        <Shield size={24} className="mx-auto mb-2" style={{ color: "var(--color-text-muted)" }} />
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          No credentials stored yet. Add API keys and secrets your workers need.
        </p>
      </div>

      <button
        className="w-full p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-colors hover:border-accent"
        style={{ borderColor: "var(--color-border-default)", color: "var(--color-text-muted)" }}
      >
        <Plus size={14} /> Add Credential
      </button>
    </div>
  );
}
