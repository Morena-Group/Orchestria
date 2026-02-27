"use client";

import type { Worker } from "@/lib/types";
import { HUMAN_SKILLS } from "@/lib/data/workers";
import { useTasks, useWorkers } from "@/lib/hooks";
import { Modal } from "@/components/ui/modal";
import { Avatar } from "@/components/ui/avatar";
import { StatusDot } from "@/components/ui/status-dot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ST } from "@/lib/constants/status";
import { Pause, Trash2 } from "lucide-react";

interface WorkerDetailModalProps {
  worker: Worker | null;
  onClose: () => void;
}

export function WorkerDetailModal({ worker, onClose }: WorkerDetailModalProps) {
  const { tasks } = useTasks();
  const { updateWorker, deleteWorker } = useWorkers();

  if (!worker) return null;

  const activeTasks = tasks.filter((t) => t.w === worker.id && t.s !== "completed");

  return (
    <Modal open={!!worker} onClose={onClose} title={worker.name} maxWidth="max-w-md">
      <div className="p-4 overflow-y-auto space-y-4">
        {/* Header info */}
        <div className="flex items-center gap-3">
          <Avatar type={worker.type} size={48} role={worker.role} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">{worker.name}</span>
              <StatusDot status={worker.status} />
            </div>
            <span className="text-xs text-text-secondary">
              {worker.isHuman ? "Human Team Member" : worker.model}
            </span>
            <div className="flex gap-1 mt-1">
              <Badge color="#c9a96e" bg="rgba(201,169,110,0.13)" small>
                {worker.isHuman ? "Human" : worker.role === "both" ? "Worker + Orchestrator" : worker.role}
              </Badge>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-bg-base">
            <span className="text-[10px] block text-text-muted">Type</span>
            <span className="text-sm font-medium text-text-primary">{worker.type}</span>
          </div>
          <div className="p-3 rounded-lg bg-bg-base">
            <span className="text-[10px] block text-text-muted">Status</span>
            <span className="text-sm font-medium text-text-primary capitalize">{worker.status}</span>
          </div>
          <div className="p-3 rounded-lg bg-bg-base">
            <span className="text-[10px] block text-text-muted">Active Tasks</span>
            <span className="text-lg font-bold text-text-primary">{worker.active}</span>
          </div>
          <div className="p-3 rounded-lg bg-bg-base">
            <span className="text-[10px] block text-text-muted">Completed</span>
            <span className="text-lg font-bold text-text-primary">{worker.done}</span>
          </div>
        </div>

        {/* Skills (for human workers) */}
        {worker.isHuman && worker.skills && worker.skills.length > 0 && (
          <div>
            <span className="text-[10px] uppercase tracking-wider text-text-muted block mb-1">Skills</span>
            <div className="flex flex-wrap gap-1">
              {worker.skills.map((sk) => {
                const skill = HUMAN_SKILLS.find((x) => x.id === sk);
                return skill ? (
                  <Badge key={sk} color="#71717a" bg="rgba(255,255,255,0.05)" small>
                    {skill.l}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Think mode (for AI workers) */}
        {!worker.isHuman && worker.think && (
          <div className="p-3 rounded-lg bg-bg-base">
            <span className="text-[10px] block text-text-muted">Think Mode</span>
            <span className="text-sm text-text-primary">{worker.think}</span>
          </div>
        )}

        {/* Active tasks */}
        {activeTasks.length > 0 && (
          <div>
            <span className="text-[10px] uppercase tracking-wider text-text-muted block mb-2">
              Active Tasks ({activeTasks.length})
            </span>
            <div className="space-y-1">
              {activeTasks.map((t) => {
                const sc = ST[t.s];
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-base"
                  >
                    <Badge color={sc.c} bg={sc.bg} small>{sc.l}</Badge>
                    <span className="text-xs flex-1 truncate text-text-primary">
                      {t.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-2 p-4 border-t border-border-default">
        <Button onClick={() => { updateWorker(worker.id, { status: worker.status === "offline" ? "online" : "offline" }); onClose(); }}>
          <Pause size={12} /> {worker.status === "offline" ? "Activate" : "Pause"} Worker
        </Button>
        <Button onClick={() => { deleteWorker(worker.id); onClose(); }}>
          <Trash2 size={12} /> Remove
        </Button>
      </div>
    </Modal>
  );
}
