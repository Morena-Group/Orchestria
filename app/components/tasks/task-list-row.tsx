"use client";

import { Lock, AlertTriangle } from "lucide-react";
import type { Task } from "@/lib/types";
import { ST, PRI } from "@/lib/constants/status";
import { useWorkers } from "@/lib/hooks";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TaskListActions } from "./task-list-actions";

interface TaskListRowProps {
  task: Task;
  onClick: () => void;
  onAction?: (taskId: string, actionId: string, comment?: string) => void;
}

export function TaskListRow({ task, onClick, onAction }: TaskListRowProps) {
  const { workers } = useWorkers();
  const worker = workers.find((w) => w.id === task.w);
  const sc = ST[task.s];
  const pc = PRI[task.p];

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-6 py-2.5 border-b border-border-default cursor-pointer hover:bg-bg-elevated transition-colors duration-150"
    >
      <div className="w-8 flex items-center justify-center">
        {task.lock && <Lock size={12} className="text-accent" />}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm truncate block text-text-primary">{task.title}</span>
        {task.block && (
          <span className="text-[10px] flex items-center gap-1 mt-0.5 text-accent">
            <AlertTriangle size={10} /> Blocked
          </span>
        )}
      </div>
      <div className="w-28">
        <Badge color={sc.c} bg={sc.bg} small>{sc.l}</Badge>
      </div>
      <div className="w-20">
        <span className="text-xs" style={{ color: pc.c }}>{pc.l}</span>
      </div>
      <div className="w-28">
        {worker ? (
          <div className="flex items-center gap-1.5">
            <Avatar type={worker.type} size={18} role={worker.role} />
            <span className="text-xs truncate text-text-secondary">{worker.name}</span>
          </div>
        ) : (
          <span className="text-xs text-text-muted">Unassigned</span>
        )}
      </div>
      <div className="w-20">
        {task.sub > 0 ? (
          <span className="text-xs text-text-secondary">{task.subD}/{task.sub}</span>
        ) : (
          <span className="text-xs text-text-muted">&mdash;</span>
        )}
      </div>
      <div className="w-24 flex gap-1 flex-wrap">
        {task.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="px-1 py-0.5 rounded text-[9px] bg-accent-dim text-accent-hover">
            {tag}
          </span>
        ))}
        {task.tags.length > 2 && (
          <span className="text-[9px] text-text-muted">+{task.tags.length - 2}</span>
        )}
      </div>
      {onAction && (
        <div className="w-8">
          <TaskListActions task={task} onAction={onAction} />
        </div>
      )}
    </div>
  );
}
