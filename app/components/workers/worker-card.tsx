"use client";

import type { Worker } from "@/lib/types";
import { HUMAN_SKILLS } from "@/lib/data/workers";
import { Avatar } from "@/components/ui/avatar";
import { StatusDot } from "@/components/ui/status-dot";
import { Badge } from "@/components/ui/badge";

interface WorkerCardProps {
  worker: Worker;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <div className="p-4 rounded-xl glass-card hover:border-[rgba(200,169,110,0.25)] transition-colors duration-150">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar type={worker.type} size={40} role={worker.role} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">{worker.name}</span>
              <StatusDot status={worker.status} />
            </div>
            <span className="text-xs text-text-secondary">
              {worker.isHuman ? "Human Team Member" : worker.model}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {worker.isHuman ? (
          <Badge color="#c9a96e" bg="rgba(201,169,110,0.13)" small>Human</Badge>
        ) : (
          <Badge
            color="#c9a96e"
            bg={worker.role === "both" ? "rgba(201,169,110,0.13)" : "rgba(201,169,110,0.13)"}
            small
          >
            {worker.role === "both" ? "Worker + Orchestrator" : worker.role}
          </Badge>
        )}
        {worker.isHuman && worker.skills?.map((sk) => {
          const skill = HUMAN_SKILLS.find((x) => x.id === sk);
          return skill ? (
            <Badge key={sk} color="#71717a" bg="rgba(255,255,255,0.05)" small>{skill.l}</Badge>
          ) : null;
        })}
        {!worker.isHuman && (
          <Badge color="#71717a" bg="rgba(255,255,255,0.05)" small>Think: {worker.think}</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 rounded-lg bg-bg-base">
          <span className="text-[10px] block text-text-muted">Active</span>
          <span className="text-lg font-bold text-text-primary">{worker.active}</span>
        </div>
        <div className="p-2 rounded-lg bg-bg-base">
          <span className="text-[10px] block text-text-muted">Done</span>
          <span className="text-lg font-bold text-text-primary">{worker.done}</span>
        </div>
      </div>
    </div>
  );
}
