"use client";

import { useState } from "react";
import { REPORT_BLOCKS } from "@/lib/data/briefings";
import { PROJECTS } from "@/lib/data/projects";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ReportBlock } from "./report-block";
import { AddBlockModal } from "./add-block-modal";
import {
  BarChart3,
  Sparkles,
  Save,
  Download,
  Plus,
  Activity,
  Bot,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileText,
  Code,
  type LucideIcon,
} from "lucide-react";

// Icon map for resolving string icon names from REPORT_BLOCKS data
export const BLOCK_ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  BarChart3,
  Activity,
  Bot,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileText,
  Code,
};

export function BriefingsView() {
  const [blocks, setBlocks] = useState<string[]>(
    REPORT_BLOCKS.filter((b) => b.default).map((b) => b.id)
  );
  const [showAdd, setShowAdd] = useState(false);
  const [period, setPeriod] = useState("24h");
  const [scope, setScope] = useState("all");
  const [generated, setGenerated] = useState<string | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Briefings
        </h2>
        <div className="flex gap-2">
          {generated && (
            <span className="text-[10px] self-center text-text-muted">
              Generated {generated}
            </span>
          )}
          <Button onClick={() => console.log("Save briefing template")}>
            <Save size={12} /> Save Template
          </Button>
          <Button onClick={() => console.log("Export briefing PDF")}>
            <Download size={12} /> Export PDF
          </Button>
          <Button
            primary
            onClick={() =>
              setGenerated(
                new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              )
            }
          >
            <Sparkles size={12} /> Generate
          </Button>
        </div>
      </div>

      {/* Scope + period filters */}
      <div className="flex items-center gap-2 mb-4">
        {["all", ...PROJECTS.map((p) => p.id)].map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className="px-3 py-1 rounded-lg text-xs border transition-colors"
            style={{
              borderColor:
                scope === s
                  ? "var(--color-accent)"
                  : "var(--color-border-default)",
              color:
                scope === s
                  ? "var(--color-accent)"
                  : "var(--color-text-secondary)",
              backgroundColor:
                scope === s ? "rgba(201, 169, 110, 0.12)" : "transparent",
            }}
          >
            {s === "all"
              ? "All Projects"
              : PROJECTS.find((p) => p.id === s)?.name ?? s}
          </button>
        ))}
        <div className="ml-auto flex gap-1">
          {["24h", "7d", "30d"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-2 py-1 rounded text-xs transition-colors"
              style={{
                backgroundColor:
                  period === p ? "rgba(201, 169, 110, 0.12)" : "transparent",
                color:
                  period === p
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Blocks */}
      {blocks.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No report blocks"
          desc="Build your custom briefing by adding report blocks. Choose from executive summaries, task stats, worker performance, and more."
          action="Add Report Block"
          onAction={() => setShowAdd(true)}
        />
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {blocks.map((bId) => {
              const bDef = REPORT_BLOCKS.find((b) => b.id === bId);
              if (!bDef) return null;
              return (
                <ReportBlock
                  key={bId}
                  block={bDef}
                  onRemove={() =>
                    setBlocks((bs) => bs.filter((b) => b !== bId))
                  }
                />
              );
            })}
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="w-full p-4 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-colors hover:border-accent"
            style={{
              borderColor: "var(--color-border-default)",
              color: "var(--color-text-muted)",
            }}
          >
            <Plus size={16} /> Add Report Block
          </button>
        </>
      )}

      {/* Add block modal */}
      <AddBlockModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        activeBlocks={blocks}
        onAddBlock={(id) => setBlocks((bs) => [...bs, id])}
      />
    </div>
  );
}
