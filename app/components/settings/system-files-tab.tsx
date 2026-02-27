"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const DEFAULT_FILES = [
  {
    id: "memory",
    name: "memory.md",
    desc: "Persistent memory for the orchestrator. Loaded on every run.",
    content: "# Orchestria Memory\n\n<!-- Add project context, decisions, and learnings here -->\n",
  },
  {
    id: "prompt",
    name: "global-prompt.md",
    desc: "System prompt prepended to every orchestrator and worker invocation.",
    content: "You are an AI worker in the Orchestria system.\n\nRules:\n1. Follow the task description exactly\n2. Ask for clarification if the task is ambiguous\n3. Write clean, typed code with no TODOs\n4. Run tests before marking complete\n5. Update memory.md if you learn something new",
  },
];

export function SystemFilesTab() {
  const [edited, setEdited] = useState<Record<string, string>>({});

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        System Files
      </h2>
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Editable config files that shape how the orchestrator and workers behave.
      </p>

      {DEFAULT_FILES.map((f) => (
        <div key={f.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label>{f.name}</Label>
              <span className="text-[10px] block" style={{ color: "var(--color-text-muted)" }}>{f.desc}</span>
            </div>
            {edited[f.id] !== undefined && (
              <Button primary onClick={() => setEdited((p) => { const n = { ...p }; delete n[f.id]; return n; })}>
                Save
              </Button>
            )}
          </div>
          <textarea
            value={edited[f.id] ?? f.content}
            onChange={(e) => setEdited((p) => ({ ...p, [f.id]: e.target.value }))}
            rows={10}
            className="w-full glass-input px-4 py-3 rounded-xl text-xs font-mono outline-none resize-y leading-relaxed"
            style={{ color: "var(--color-text-primary)" }}
          />
        </div>
      ))}
    </div>
  );
}
