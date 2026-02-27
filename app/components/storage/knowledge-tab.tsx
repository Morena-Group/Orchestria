"use client";

import { useState } from "react";
import { useStorage } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Search, Plus, Pin, ArrowRight, ChevronDown, ChevronRight,
  File, Brain, Puzzle, FileText, CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { KnowledgeType } from "@/lib/types";

const TYPE_ICONS: Record<KnowledgeType, LucideIcon> = {
  artifact: File,
  memory_fact: Brain,
  plugin_data: Puzzle,
  file: FileText,
  task_output: CheckCircle2,
};

export function KnowledgeTab() {
  const { knowledge, memoryFacts } = useStorage();
  const [kiSearch, setKiSearch] = useState("");
  const [mfSearch, setMfSearch] = useState("");
  const [pinnedDocs, setPinnedDocs] = useState(["ki1", "ki2"]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const filteredKI = knowledge.filter((ki) => {
    if (!kiSearch) return true;
    const q = kiSearch.toLowerCase();
    return (
      ki.label.toLowerCase().includes(q) ||
      ki.summary.toLowerCase().includes(q) ||
      ki.tags.some((t) => t.includes(q))
    );
  });

  const filteredMF = memoryFacts.filter((mf) => {
    if (!mfSearch) return true;
    const q = mfSearch.toLowerCase();
    return mf.content.toLowerCase().includes(q) || mf.tags.some((t) => t.includes(q));
  });

  const totalIndexTokens = knowledge.reduce((s, ki) => s + ki.tokens, 0);
  const pinnedTokens = knowledge.filter((ki) => pinnedDocs.includes(ki.id)).reduce((s, ki) => s + ki.tokens, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Knowledge Index */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Knowledge Index
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              The orchestrator&apos;s high-level map. Always loaded in context ({totalIndexTokens} tokens).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
              <input
                value={kiSearch}
                onChange={(e) => setKiSearch(e.target.value)}
                placeholder="Search index..."
                className="glass-input pl-7 pr-3 py-1.5 rounded-lg text-[10px] outline-none"
              />
            </div>
            <Button><Plus size={12} /> Add Entry</Button>
          </div>
        </div>

        {/* Scannable list */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border-default)" }}>
          {filteredKI.map((ki) => {
            const isPinned = pinnedDocs.includes(ki.id);
            const isExpanded = expandedEntry === ki.id;
            const TypeIcon = TYPE_ICONS[ki.type] ?? File;

            return (
              <div
                key={ki.id}
                className="border-b last:border-b-0"
                style={{ borderColor: "var(--color-border-default)" }}
              >
                {/* Single-line row */}
                <div
                  onClick={() => setExpandedEntry(isExpanded ? null : ki.id)}
                  className="flex items-center gap-2.5 px-4 py-2.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPinnedDocs((p) =>
                        p.includes(ki.id) ? p.filter((x) => x !== ki.id) : [...p, ki.id]
                      );
                    }}
                    className="flex-shrink-0"
                  >
                    <Pin size={12} style={{ color: isPinned ? "var(--color-accent)" : "var(--color-text-muted)" }} />
                  </button>
                  <TypeIcon size={14} style={{ color: "var(--color-accent)" }} className="flex-shrink-0" />
                  <span className="text-xs truncate flex-1" style={{ color: "var(--color-text-primary)" }}>
                    {ki.label}
                  </span>
                  <span className="text-[10px] flex-shrink-0 hidden sm:block" style={{ color: "var(--color-text-muted)" }}>
                    {ki.proj}
                  </span>
                  <span className="text-[10px] flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>
                    {ki.updated}
                  </span>
                  {isExpanded ? (
                    <ChevronDown size={12} style={{ color: "var(--color-text-muted)" }} className="flex-shrink-0" />
                  ) : (
                    <ChevronRight size={12} style={{ color: "var(--color-text-muted)" }} className="flex-shrink-0" />
                  )}
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div
                    className="px-4 py-3 border-t"
                    style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}
                  >
                    <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--color-text-secondary)" }}>
                      {ki.summary}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                        {ki.tokens} tokens
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                        Type: {ki.type.replace("_", " ")}
                      </span>
                      {ki.tags.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded text-[9px]"
                          style={{ backgroundColor: "var(--color-accent-dim)", color: "var(--color-accent-hover)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            {knowledge.length} entries &bull; {totalIndexTokens} tokens total &bull;{" "}
            {pinnedDocs.length} pinned ({pinnedTokens} tokens)
          </span>
        </div>
      </div>

      {/* Memory Facts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Memory Facts
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              Extracted knowledge from completed tasks. Searchable via semantic similarity (pgvector).
            </p>
          </div>
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
            <input
              value={mfSearch}
              onChange={(e) => setMfSearch(e.target.value)}
              placeholder="Semantic search: ask a question..."
              className="glass-input pl-7 pr-3 py-1.5 rounded-lg text-[10px] outline-none"
              style={{ width: 280 }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          {filteredMF.map((mf) => (
            <div
              key={mf.id}
              className="p-2 rounded-lg border"
              style={{
                backgroundColor: "var(--color-glass)",
                borderColor: "var(--color-glass-border)",
              }}
            >
              <p className="text-xs leading-relaxed mb-1.5" style={{ color: "var(--color-text-primary)" }}>
                {mf.content}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                  <ArrowRight size={10} /> from:{" "}
                  <span style={{ color: "var(--color-accent-hover)" }}>{mf.source}</span>
                </span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>&bull;</span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{mf.proj}</span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>&bull;</span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{mf.date}</span>
                <div className="ml-auto flex gap-1">
                  {mf.tags.map((t) => (
                    <span key={t} className="px-1 py-0.5 rounded text-[9px]" style={{ backgroundColor: "var(--color-accent-dim)", color: "var(--color-accent-hover)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            {memoryFacts.length} facts stored &bull; vector embeddings: text-embedding-3-small (1536d)
          </span>
        </div>
      </div>
    </div>
  );
}
