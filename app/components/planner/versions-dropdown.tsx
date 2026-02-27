"use client";

import { GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VersionsDropdownProps {
  open: boolean;
}

const VERSIONS = [
  { id: "v3", name: "v3 — After adding 2FA", date: "Today 10:30" },
  { id: "v2", name: "v2 — Expanded testing", date: "Today 09:15" },
  { id: "v1", name: "v1 — Initial plan", date: "Yesterday" },
];

export function VersionsDropdown({ open }: VersionsDropdownProps) {
  if (!open) return null;

  return (
    <div
      className="absolute right-0 top-full mt-1 w-64 rounded-xl border p-3 z-30"
      style={{
        backgroundColor: "var(--color-bg-deep)",
        borderColor: "var(--color-border-default)",
      }}
    >
      <h4
        className="text-xs font-semibold mb-2"
        style={{ color: "var(--color-text-muted)" }}
      >
        Version History
      </h4>
      {VERSIONS.map((v) => (
        <div
          key={v.id}
          className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/5"
        >
          <GitBranch size={12} style={{ color: "var(--color-accent)" }} />
          <div>
            <span
              className="text-xs block"
              style={{ color: "var(--color-text-primary)" }}
            >
              {v.name}
            </span>
            <span
              className="text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {v.date}
            </span>
          </div>
        </div>
      ))}
      <div
        className="mt-2 pt-2 border-t"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <Input placeholder="Name this version..." />
        <button
          className="w-full mt-2 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-accent-fg)",
          }}
        >
          Save Version
        </button>
      </div>
    </div>
  );
}
