"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/lib/hooks";
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
  const { settings, loading, update } = useSettings();
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  // Initialize from saved settings
  useEffect(() => {
    if (!loading && !initialized && settings.systemFiles) {
      const saved: Record<string, string> = {};
      for (const f of DEFAULT_FILES) {
        if (settings.systemFiles[f.id]) {
          saved[f.id] = settings.systemFiles[f.id];
        }
      }
      if (Object.keys(saved).length > 0) setEdited(saved);
      setInitialized(true);
    }
  }, [loading, initialized, settings.systemFiles]);

  function handleSave(fileId: string) {
    const content = edited[fileId];
    if (content === undefined) return;
    const current = settings.systemFiles ?? {};
    update("systemFiles", { ...current, [fileId]: content });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        System Files
      </h2>
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Editable config files that shape how the orchestrator and workers behave.
      </p>

      {DEFAULT_FILES.map((f) => {
        const savedContent = settings.systemFiles?.[f.id];
        const currentContent = edited[f.id] ?? savedContent ?? f.content;
        const baseContent = savedContent ?? f.content;
        const isDirty = currentContent !== baseContent;

        return (
          <div key={f.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label>{f.name}</Label>
                <span className="text-[10px] block" style={{ color: "var(--color-text-muted)" }}>{f.desc}</span>
              </div>
              {isDirty && (
                <Button primary onClick={() => handleSave(f.id)}>
                  Save
                </Button>
              )}
            </div>
            <textarea
              value={currentContent}
              onChange={(e) => setEdited((p) => ({ ...p, [f.id]: e.target.value }))}
              rows={10}
              className="w-full glass-input px-4 py-3 rounded-xl text-xs font-mono outline-none resize-y leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
            />
          </div>
        );
      })}
    </div>
  );
}
