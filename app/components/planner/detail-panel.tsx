"use client";

import { useState, useEffect } from "react";
import type { PlanNode, ActivityType } from "@/lib/types";
import { ST, ACT } from "@/lib/constants/status";
import { useWorkers } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Check, Trash2, Link } from "lucide-react";

interface DetailPanelProps {
  node: PlanNode;
  allNodes: PlanNode[];
  onSelectNode: (id: string | null) => void;
  onClose: () => void;
  onSave: (nodeId: string, updates: Partial<PlanNode>) => void;
  onDelete: (nodeId: string) => void;
}

export function DetailPanel({
  node,
  allNodes,
  onSelectNode,
  onClose,
  onSave,
  onDelete,
}: DetailPanelProps) {
  const { workers } = useWorkers();
  const [status, setStatus] = useState(node.status);
  const [priority, setPriority] = useState(node.priority);
  const [activity, setActivity] = useState(node.act ?? "none");
  const [worker, setWorker] = useState(node.worker ?? "auto");
  const [review, setReview] = useState(node.review);

  // Reset local state when node changes
  useEffect(() => {
    setStatus(node.status);
    setPriority(node.priority);
    setActivity(node.act ?? "none");
    setWorker(node.worker ?? "auto");
    setReview(node.review);
  }, [node.id, node.status, node.priority, node.act, node.worker, node.review]);
  const children = allNodes.filter((n) => node.children.includes(n.id));
  const parents = allNodes.filter((n) => n.children.includes(node.id));

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {node.label}
        </h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/5">
          <X size={14} style={{ color: "var(--color-text-secondary)" }} />
        </button>
      </div>

      <p
        className="text-xs mb-4"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {node.description}
      </p>

      {/* Editable fields */}
      <div className="space-y-3">
        <div>
          <Label>Status</Label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as PlanNode["status"])}>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="running">Running</option>
            <option value="awaiting_input">Awaiting Input</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </Select>
        </div>

        <div>
          <Label>Priority</Label>
          <Select value={priority} onChange={(e) => setPriority(e.target.value as PlanNode["priority"])}>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>

        <div>
          <Label>Activity</Label>
          <Select value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="none">None</option>
            {Object.entries(ACT).map(([k, v]) => (
              <option key={k} value={k}>
                {v.l} — {v.desc}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Worker</Label>
          <Select value={worker} onChange={(e) => setWorker(e.target.value)}>
            <option value="auto">Auto (Orchestrator)</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.isHuman ? "👤" : "🤖"} {w.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Review By</Label>
          <Select value={review} onChange={(e) => setReview(e.target.value)}>
            <option>Orchestrator decides</option>
            <option>Orchestrator review</option>
            <option>Human Review</option>
            {workers.filter((w) => w.isHuman).map((w) => (
              <option key={w.id}>{w.name}</option>
            ))}
          </Select>
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-1">
            {node.tags.map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.5 rounded text-[10px]"
                style={{
                  backgroundColor: "var(--color-accent-dim)",
                  color: "var(--color-accent-hover)",
                }}
              >
                {t}
              </span>
            ))}
            <button
              onClick={() => {
                const tag = prompt("Tag name:");
                if (tag?.trim()) onSave(node.id, { tags: [...(node.tags ?? []), tag.trim()] });
              }}
              className="px-1.5 py-0.5 rounded text-[10px] border border-dashed"
              style={{
                borderColor: "var(--color-border-default)",
                color: "var(--color-text-muted)",
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Children list */}
        {children.length > 0 && (
          <div>
            <Label>Children ({children.length})</Label>
            <div className="space-y-1">
              {children.map((ch) => {
                const chSc = ST[ch.status] ?? ST.draft;
                return (
                  <div
                    key={ch.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-white/5"
                    style={{ backgroundColor: "var(--color-bg-card)" }}
                    onClick={() => onSelectNode(ch.id)}
                  >
                    <Badge color={chSc.c} bg={chSc.bg} small>
                      {chSc.l}
                    </Badge>
                    <span
                      className="text-xs flex-1 truncate"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {ch.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dependencies (parent nodes) */}
        {node.level > 0 && parents.length > 0 && (
          <div>
            <Label>Depends on</Label>
            <div className="space-y-1">
              {parents.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-white/5"
                  style={{ backgroundColor: "var(--color-bg-card)" }}
                  onClick={() => onSelectNode(p.id)}
                >
                  <Link
                    size={10}
                    style={{ color: "var(--color-accent)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lock node */}
        <label
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer"
          style={{ backgroundColor: "var(--color-bg-card)" }}
        >
          <input type="checkbox" className="accent-[#c9a96e]" />
          <div>
            <span
              className="text-xs"
              style={{ color: "var(--color-text-primary)" }}
            >
              Lock node
            </span>
            <p
              className="text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Prevent orchestrator from modifying
            </p>
          </div>
        </label>
      </div>

      {/* Footer actions */}
      <div
        className="flex gap-2 mt-4 pt-4 border-t"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <Button
          primary
          onClick={() =>
            onSave(node.id, {
              status,
              priority,
              act: activity === "none" ? null : activity as ActivityType,
              worker: worker === "auto" ? null : worker,
              review,
            })
          }
        >
          <Check size={12} /> Save
        </Button>
        <button
          onClick={() => onDelete(node.id)}
          className="p-2 rounded hover:bg-white/5"
          title="Delete"
        >
          <Trash2 size={14} style={{ color: "var(--color-error)" }} />
        </button>
      </div>
    </div>
  );
}
