"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useWorkers, useSettings } from "@/lib/hooks";
import { WT } from "@/lib/constants/status";
import { FileText } from "lucide-react";

const DEFAULT_PROMPT = "You are an AI worker in the Orchestria system. Follow task instructions precisely. Ask for clarification if ambiguous. Write clean, typed code. Run tests before marking complete.";

export function AgentDefaultsTab() {
  const { workers } = useWorkers();
  const { settings, loading, update } = useSettings();
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT);
  const [routing, setRouting] = useState("auto");
  const [reviewMode, setReviewMode] = useState("always");

  // Initialize from saved settings
  useEffect(() => {
    if (!loading && settings.agentDefaults) {
      if (settings.agentDefaults.systemPrompt) setSystemPrompt(settings.agentDefaults.systemPrompt);
      if (settings.agentDefaults.routing) setRouting(settings.agentDefaults.routing);
      if (settings.agentDefaults.reviewMode) setReviewMode(settings.agentDefaults.reviewMode);
    }
  }, [loading, settings.agentDefaults]);

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        Agent Defaults
      </h2>
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Global defaults for orchestrator and worker behavior. Can be overridden per-worker.
      </p>

      {/* System Prompt */}
      <div>
        <Label>Default System Prompt</Label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          rows={4}
          className="w-full glass-input px-4 py-3 rounded-xl text-xs font-mono outline-none resize-y leading-relaxed mt-1"
          style={{ color: "var(--color-text-primary)" }}
        />
      </div>

      {/* Routing Strategy */}
      <div>
        <Label>Task Routing Strategy</Label>
        <Select value={routing} onChange={(e) => setRouting(e.target.value)}>
          <option value="auto">Auto (Orchestrator decides)</option>
          <option value="round_robin">Round Robin</option>
          <option value="skill_based">Skill-Based</option>
          <option value="cost_optimized">Cost-Optimized</option>
        </Select>
      </div>

      {/* Review Mode */}
      <div>
        <Label>Review Mode</Label>
        <Select value={reviewMode} onChange={(e) => setReviewMode(e.target.value)}>
          <option value="always">Always Review (every task goes to review)</option>
          <option value="auto_low_risk">Auto-Approve Low Risk</option>
          <option value="never">Never Review (auto-approve all)</option>
        </Select>
      </div>

      {/* Worker Setup Guides */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-primary)" }}>
          Worker Setup Guides
        </h3>
        <div className="space-y-2">
          {workers.map((w) => (
            <div
              key={w.id}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ backgroundColor: "var(--color-bg-elevated)" }}
              >
                {WT[w.type]?.a ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium block" style={{ color: "var(--color-text-primary)" }}>
                  {w.name}
                </span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                  {w.model} &bull; {w.role}
                </span>
              </div>
              <button
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] transition-colors"
                style={{ color: "var(--color-accent)", backgroundColor: "var(--color-accent-dim)" }}
              >
                <FileText size={10} />
                View Guide
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button primary onClick={() => update("agentDefaults", { systemPrompt, routing, reviewMode })}>
        Save Defaults
      </Button>
    </div>
  );
}
