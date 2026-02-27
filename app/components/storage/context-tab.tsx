"use client";

import { useState } from "react";
import { KNOWLEDGE_INDEX, COMPACTION_LOG } from "@/lib/data/storage";
import { PROJECTS } from "@/lib/data/projects";
import { Label } from "@/components/ui/label";
import { Globe, Clock, Settings, Check, Pin, X, CheckCircle2, Sparkles } from "lucide-react";

const MODES = [
  { id: "full" as const, l: "Full Overview", desc: "Top N facts across ALL projects and time. Wide coverage, less depth per item.", icon: Globe, best: "New projects, small knowledge bases" },
  { id: "recency" as const, l: "Recency Bias", desc: "Similarity \u00d7 0.7 + Recency \u00d7 0.3. Recent info prioritized, older not excluded.", icon: Clock, best: "Active dev, fast-moving projects" },
  { id: "custom" as const, l: "Custom", desc: "Set weights, pin docs, exclude projects, adjust thresholds. Full control.", icon: Settings, best: "Power users, multi-project setups" },
] as const;

export function ContextTab() {
  const [contextMode, setContextMode] = useState<"full" | "recency" | "custom">("recency");
  const [tokenBudget, setTokenBudget] = useState(8000);
  const [pinnedDocs, setPinnedDocs] = useState(["ki1", "ki2"]);
  const [excludedProjects, setExcludedProjects] = useState<string[]>([]);

  const totalIndexTokens = KNOWLEDGE_INDEX.reduce((s, ki) => s + ki.tokens, 0);
  const pinnedTokens = KNOWLEDGE_INDEX.filter((ki) => pinnedDocs.includes(ki.id)).reduce((s, ki) => s + ki.tokens, 0);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Context Modes */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>Context Mode</h3>
        <p className="text-[10px] mb-4" style={{ color: "var(--color-text-muted)" }}>
          Controls how the orchestrator selects which knowledge to load into its context window.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = contextMode === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setContextMode(m.id)}
                className="p-4 rounded-xl border cursor-pointer transition-colors"
                style={{
                  borderColor: active ? "var(--color-accent)" : "var(--color-border-default)",
                  backgroundColor: active ? "rgba(201, 169, 110, 0.04)" : "transparent",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {active ? (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--color-accent)" }}>
                      <Check size={10} style={{ color: "var(--color-accent-fg)" }} />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border" style={{ borderColor: "var(--color-border-default)" }} />
                  )}
                  <Icon size={16} style={{ color: active ? "var(--color-accent)" : "var(--color-text-secondary)" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{m.l}</span>
                </div>
                <p className="text-[11px] leading-relaxed mb-2" style={{ color: "var(--color-text-secondary)" }}>{m.desc}</p>
                <span className="text-[9px]" style={{ color: "var(--color-text-muted)" }}>Best for: {m.best}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Mode Settings */}
      {contextMode === "custom" && (
        <div className="mb-8 p-4 rounded-xl border" style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}>
          <h4 className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>Custom Mode Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label>Similarity Weight</Label>
              <input type="range" min="0" max="100" defaultValue="70" className="flex-1 accent-[#c9a96e]" />
              <span className="text-xs w-8" style={{ color: "var(--color-text-secondary)" }}>0.7</span>
            </div>
            <div className="flex items-center gap-4">
              <Label>Recency Weight</Label>
              <input type="range" min="0" max="100" defaultValue="30" className="flex-1 accent-[#c9a96e]" />
              <span className="text-xs w-8" style={{ color: "var(--color-text-secondary)" }}>0.3</span>
            </div>
            <div className="flex items-center gap-4">
              <Label>Similarity Threshold</Label>
              <input type="range" min="0" max="100" defaultValue="60" className="flex-1 accent-[#c9a96e]" />
              <span className="text-xs w-8" style={{ color: "var(--color-text-secondary)" }}>0.6</span>
            </div>
            <div>
              <Label>Pinned Documents ({pinnedDocs.length})</Label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {KNOWLEDGE_INDEX.filter((ki) => pinnedDocs.includes(ki.id)).map((ki) => (
                  <div key={ki.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                    <Pin size={10} style={{ color: "var(--color-accent)" }} />
                    <span className="text-[10px]" style={{ color: "var(--color-text-primary)" }}>{ki.label}</span>
                    <button onClick={() => setPinnedDocs((p) => p.filter((x) => x !== ki.id))} className="p-0.5 rounded hover:bg-white/5">
                      <X size={8} style={{ color: "var(--color-text-muted)" }} />
                    </button>
                  </div>
                ))}
                <button className="px-2 py-1 rounded-lg text-[10px] border border-dashed" style={{ borderColor: "var(--color-border-default)", color: "var(--color-text-muted)" }}>
                  + Pin
                </button>
              </div>
            </div>
            <div>
              <Label>Excluded Projects</Label>
              <div className="flex gap-2 mt-1">
                {PROJECTS.map((p) => {
                  const ex = excludedProjects.includes(p.id);
                  return (
                    <label key={p.id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg cursor-pointer" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                      <input
                        type="checkbox"
                        checked={ex}
                        onChange={() =>
                          setExcludedProjects((prev) =>
                            prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
                          )
                        }
                        className="accent-red-500"
                      />
                      <span className="text-[10px]" style={{ color: "var(--color-text-primary)" }}>{p.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Token Budget */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>Token Budget</h3>
        <p className="text-[10px] mb-4" style={{ color: "var(--color-text-muted)" }}>
          Maximum tokens allocated to historical knowledge in the orchestrator&apos;s context window.
        </p>
        <div className="p-4 rounded-xl border" style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                {totalIndexTokens.toLocaleString()}
              </span>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                / {tokenBudget.toLocaleString()} tokens
              </span>
            </div>
            <select
              value={tokenBudget}
              onChange={(e) => setTokenBudget(Number(e.target.value))}
              className="glass-input px-2 py-1 rounded text-xs outline-none"
            >
              <option value={4000}>4K (minimal)</option>
              <option value={8000}>8K (default)</option>
              <option value={16000}>16K (expanded)</option>
              <option value={32000}>32K (maximum)</option>
            </select>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: "var(--color-bg-deep)" }}>
            <div className="h-full" style={{ width: `${Math.min((pinnedTokens / tokenBudget) * 100, 100)}%`, backgroundColor: "var(--color-accent)" }} title="Pinned Docs" />
            <div className="h-full" style={{ width: `${Math.min(((totalIndexTokens - pinnedTokens) / tokenBudget) * 100, 100)}%`, backgroundColor: "var(--color-accent-hover)" }} title="Unpinned Index" />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "var(--color-accent)" }} />
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Pinned ({pinnedTokens})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "var(--color-accent-hover)" }} />
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Index ({totalIndexTokens - pinnedTokens})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm border" style={{ backgroundColor: "var(--color-bg-deep)", borderColor: "var(--color-border-default)" }} />
              <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Available ({(tokenBudget - totalIndexTokens).toLocaleString()})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compaction Log */}
      <div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>Compaction Log</h3>
        <p className="text-[10px] mb-3" style={{ color: "var(--color-text-muted)" }}>
          After task completion, raw steps are compacted into memory facts. This keeps the database lean.
        </p>
        <div className="space-y-2">
          {COMPACTION_LOG.map((cl) => (
            <div key={cl.id} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                {cl.status === "done" ? (
                  <CheckCircle2 size={16} style={{ color: "var(--color-accent)" }} />
                ) : (
                  <Clock size={16} style={{ color: "var(--color-accent)" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs block truncate" style={{ color: "var(--color-text-primary)" }}>{cl.task}</span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{cl.run} &bull; {cl.date}</span>
              </div>
              {cl.status === "done" ? (
                <>
                  <div className="text-center">
                    <span className="text-sm font-bold block" style={{ color: "var(--color-accent)" }}>{cl.factsExtracted}</span>
                    <span className="text-[9px]" style={{ color: "var(--color-text-muted)" }}>facts</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold block" style={{ color: "var(--color-error)" }}>{cl.stepsDeleted}</span>
                    <span className="text-[9px]" style={{ color: "var(--color-text-muted)" }}>steps deleted</span>
                  </div>
                </>
              ) : (
                <span className="text-[10px]" style={{ color: "var(--color-accent)" }}>{cl.note}</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: "var(--color-bg-card)" }}>
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "var(--color-accent)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-primary)" }}>How compaction works</span>
          </div>
          <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            During execution, every agent step is logged for full transparency. After completion, key facts and decisions are extracted into Memory Facts with vector embeddings. Raw steps are then deleted. This preserves knowledge while keeping the database lean.
          </p>
        </div>
      </div>
    </div>
  );
}
