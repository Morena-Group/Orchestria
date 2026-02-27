"use client";

import { Lock, AlertTriangle, CheckCircle2, Plus } from "lucide-react";
import type { Task } from "@/lib/types";
import { PRI } from "@/lib/constants/status";
import { useWorkers } from "@/lib/hooks";
import { Avatar } from "@/components/ui/avatar";
import { TaskCardActions } from "./task-card-actions";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onAction?: (taskId: string, actionId: string, comment?: string) => void;
}

export function TaskCard({ task, onClick, onAction }: TaskCardProps) {
  const { workers } = useWorkers();
  const worker = workers.find((w) => w.id === task.w);

  return (
    <div
      onClick={onClick}
      className="p-3 rounded-lg cursor-pointer group glass-input hover:border-[rgba(200,169,110,0.15)] transition-all duration-150 relative"
    >
      <div className="flex items-center gap-1.5 mb-2 min-w-0">
        {task.lock && <Lock size={12} className="text-accent flex-shrink-0" />}
        <span className="text-sm font-medium truncate text-text-primary flex-1">{task.title}</span>
        {onAction && (
          <TaskCardActions task={task} onAction={onAction} />
        )}
      </div>

      {task.block && (
        <div className="mb-2 p-2 rounded text-xs flex items-start gap-1.5 bg-accent-dim text-accent">
          <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{task.block}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {task.tags.map((t) => (
          <span
            key={t}
            className="px-1.5 py-0.5 rounded text-[10px] bg-accent-dim text-accent-hover"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {worker ? (
            <Avatar type={worker.type} size={22} role={worker.role} />
          ) : (
            <div className="w-[22px] h-[22px] rounded-full border border-dashed border-text-muted flex items-center justify-center">
              <Plus size={10} className="text-text-muted" />
            </div>
          )}
          {task.sub > 0 && (
            <span className="text-[11px] flex items-center gap-1 text-text-secondary">
              <CheckCircle2 size={11} />
              {task.subD}/{task.sub}
            </span>
          )}
        </div>
        {PRI[task.p] && (
          <span className="text-[11px]" style={{ color: PRI[task.p].c }}>
            {PRI[task.p].l}
          </span>
        )}
      </div>
    </div>
  );
}
