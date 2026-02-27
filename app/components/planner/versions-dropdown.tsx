"use client";

import { GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VersionsDropdownProps {
  open: boolean;
}

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
      <div className="py-3 text-center">
        <GitBranch size={16} className="mx-auto mb-1" style={{ color: "var(--color-text-muted)" }} />
        <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
          No versions saved yet.
        </p>
      </div>
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
