"use client";

import { useState, useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { getActionIcon } from "@/lib/constants/icons";
import { TASK_ACTIONS, type TaskAction } from "./task-actions-config";
import { MiniCommentForm } from "./mini-comment-form";
import type { Task } from "@/lib/types";

interface TaskCardActionsProps {
  task: Task;
  onAction: (taskId: string, actionId: string, comment?: string) => void;
}

export function TaskCardActions({ task, onAction }: TaskCardActionsProps) {
  const [open, setOpen] = useState(false);
  const [commentAction, setCommentAction] = useState<TaskAction | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const actions = TASK_ACTIONS[task.s] ?? [];

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCommentAction(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (actions.length === 0) return null;

  function handleAction(action: TaskAction) {
    if (action.requiresComment) {
      setCommentAction(action);
      return;
    }
    onAction(task.id, action.id);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <MoreHorizontal size={14} className="text-text-secondary" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[180px] rounded-lg border shadow-lg z-20 py-1"
          style={{
            borderColor: "var(--color-border-default)",
            backgroundColor: "var(--color-bg-deep)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {commentAction ? (
            <div className="px-2 py-1">
              <MiniCommentForm
                actionLabel={commentAction.label}
                onSubmit={(comment) => {
                  onAction(task.id, commentAction.id, comment);
                  setOpen(false);
                  setCommentAction(null);
                }}
                onCancel={() => setCommentAction(null)}
              />
            </div>
          ) : (
            actions.map((action) => {
              const Icon = getActionIcon(action.icon);
              return (
                <button
                  key={action.id}
                  onClick={(e) => { e.stopPropagation(); handleAction(action); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-white/5 transition-colors"
                  style={{
                    color: action.variant === "danger"
                      ? "var(--color-error)"
                      : action.variant === "primary"
                      ? "var(--color-accent)"
                      : "var(--color-text-secondary)",
                  }}
                >
                  <Icon size={12} />
                  {action.label}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
