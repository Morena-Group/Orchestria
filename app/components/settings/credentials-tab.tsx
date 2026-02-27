"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const TIERS = [
  { t: "Open", c: "var(--color-text-primary)", d: "Worker reads directly. For non-sensitive config.", i: "\uD83D\uDFE2" },
  { t: "Gated", c: "var(--color-accent)", d: "Requires your approval per use. Default.", i: "\uD83D\uDFE1" },
  { t: "Ephemeral", c: "var(--color-error)", d: "Subagent uses it and discards. Never enters context.", i: "\uD83D\uDD34" },
];

const CREDENTIALS = [
  { n: "Stripe API Key", tier: "Gated", scope: "AI SaaS Platform" },
  { n: "AWS Access Key", tier: "Ephemeral", scope: "Global" },
  { n: "Test DB Password", tier: "Open", scope: "Data Pipeline v2" },
  { n: "GitHub Token", tier: "Gated", scope: "Global" },
];

function tierColor(tier: string) {
  if (tier === "Open") return "var(--color-text-primary)";
  if (tier === "Gated") return "var(--color-accent)";
  return "var(--color-error)";
}

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

      {/* Credentials list */}
      {CREDENTIALS.map((cr) => (
        <div key={cr.n} className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{cr.n}</span>
            <div className="flex items-center gap-2">
              <Badge color={tierColor(cr.tier)}>{cr.tier}</Badge>
              <Badge color="#71717a" bg="var(--color-bg-elevated)">{cr.scope}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
              readOnly
              className="glass-input flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
            />
            <Button>Edit</Button>
          </div>
        </div>
      ))}

      <button
        className="w-full p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-colors hover:border-accent"
        style={{ borderColor: "var(--color-border-default)", color: "var(--color-text-muted)" }}
      >
        <Plus size={14} /> Add Credential
      </button>
    </div>
  );
}
