"use client";

import { useState } from "react";
import { KNOWLEDGE_INDEX, MEMORY_FACTS } from "@/lib/data/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Pin, ArrowRight } from "lucide-react";

export function KnowledgeTab() {
  const [kiSearch, setKiSearch] = useState("");
  const [mfSearch, setMfSearch] = useState("");
  const [pinnedDocs, setPinnedDocs] = useState(["ki1", "ki2"]);

  const filteredKI = KNOWLEDGE_INDEX.filter((ki) => {
    if (!kiSearch) return true;
    const q = kiSearch.toLowerCase();
    return (
      ki.label.toLowerCase().includes(q) ||
      ki.summary.toLowerCase().includes(q) ||
      ki.tags.some((t) => t.includes(q))
    );
  });

  const filteredMF = MEMORY_FACTS.filter((mf) => {
    if (!mfSearch) return true;
    const q = mfSearch.toLowerCase();
    return mf.content.toLowerCase().includes(q) || mf.tags.some((t) => t.includes(q));
  });

  const totalIndexTokens = KNOWLEDGE_INDEX.reduce((s, ki) => s + ki.tokens, 0);
  const pinnedTokens = KNOWLEDGE_INDEX.filter((ki) => pinnedDocs.includes(ki.id)).reduce((s, ki) => s + ki.tokens, 0);

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

        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border-default)" }}>
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-1.5 text-[9px] uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)", backgroundColor: "var(--color-bg-card)" }}
          >
            <span className="w-5" />
            <span className="w-20">Type</span>
            <span className="flex-1">Label & Summary</span>
            <span className="w-28">Project</span>
            <span className="w-12">Tokens</span>
            <span className="w-16 text-right">Updated</span>
          </div>

          {/* Rows */}
          {filteredKI.map((ki) => {
            const isPinned = pinnedDocs.includes(ki.id);
            return (
              <div
                key={ki.id}
                className="flex items-center gap-3 px-4 py-2.5 border-t"
                style={{ borderColor: "var(--color-border-default)" }}
              >
                <button
                  onClick={() =>
                    setPinnedDocs((p) =>
                      p.includes(ki.id) ? p.filter((x) => x !== ki.id) : [...p, ki.id]
                    )
                  }
                  className="w-5"
                >
                  <Pin size={12} style={{ color: isPinned ? "var(--color-accent)" : "var(--color-text-muted)" }} />
                </button>
                <div className="w-20">
                  <Badge color="var(--color-accent)" small>
                    {ki.type.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs block truncate" style={{ color: "var(--color-text-primary)" }}>
                    {ki.label}
                  </span>
                  <span className="text-[10px] block truncate" style={{ color: "var(--color-text-muted)" }}>
                    {ki.summary}
                  </span>
                </div>
                <span className="w-28 text-[10px] truncate" style={{ color: "var(--color-text-muted)" }}>
                  {ki.proj}
                </span>
                <span className="w-12 text-[10px] text-center" style={{ color: "var(--color-text-secondary)" }}>
                  {ki.tokens}
                </span>
                <span className="w-16 text-[10px] text-right" style={{ color: "var(--color-text-muted)" }}>
                  {ki.updated}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            {KNOWLEDGE_INDEX.length} entries &bull; {totalIndexTokens} tokens total &bull;{" "}
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

        <div className="space-y-2">
          {filteredMF.map((mf) => (
            <div
              key={mf.id}
              className="p-3 rounded-xl border"
              style={{
                backgroundColor: "var(--color-glass)",
                borderColor: "var(--color-glass-border)",
              }}
            >
              <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--color-text-primary)" }}>
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
            {MEMORY_FACTS.length} facts stored &bull; vector embeddings: text-embedding-3-small (1536d)
          </span>
        </div>
      </div>
    </div>
  );
}
