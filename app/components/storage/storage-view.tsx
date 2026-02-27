"use client";

import { useState } from "react";
import { FilesTab } from "./files-tab";
import { KnowledgeTab } from "./knowledge-tab";
import { ContextTab } from "./context-tab";
import { File, Brain, Target } from "lucide-react";

const TABS = [
  { id: "files", l: "Files", icon: File },
  { id: "knowledge", l: "Knowledge", icon: Brain },
  { id: "context", l: "Context", icon: Target },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function StorageView() {
  const [tab, setTab] = useState<TabId>("files");

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div
        className="flex items-center gap-1 px-6 pt-4 pb-0 flex-shrink-0"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm transition-colors"
              style={{
                backgroundColor:
                  tab === t.id ? "var(--color-bg-card)" : "transparent",
                color:
                  tab === t.id
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
                borderBottom:
                  tab === t.id
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
              }}
            >
              <Icon size={14} />
              {t.l}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div
        className="flex-1 flex overflow-hidden border-t"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        {tab === "files" && <FilesTab />}
        {tab === "knowledge" && <KnowledgeTab />}
        {tab === "context" && <ContextTab />}
      </div>
    </div>
  );
}
