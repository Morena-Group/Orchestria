"use client";

import { useState } from "react";
import { Plus, Filter, Layers, ListTodo } from "lucide-react";
import type { Task, TaskStatus } from "@/lib/types";
import { TASKS } from "@/lib/data/tasks";
import { ST, PRI, KANBAN_COLUMNS } from "@/lib/constants/status";
import { getStatusIcon } from "@/lib/constants/icons";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskListRow } from "@/components/tasks/task-list-row";
import { NewTaskModal } from "@/components/tasks/new-task-modal";
import { TaskModal } from "@/components/tasks/task-modal";

export default function TasksPage() {
  const [showNew, setShowNew] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [sortBy, setSortBy] = useState("status");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  function handleAction(taskId: string, actionId: string, comment?: string) {
    console.log("Task action:", { taskId, actionId, comment });
  }

  // Filter to active project (p1 for now)
  const proj = "p1";
  const tasks = TASKS.filter((t) => t.pr === proj);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "status") return KANBAN_COLUMNS.indexOf(a.s) - KANBAN_COLUMNS.indexOf(b.s);
    if (sortBy === "priority") {
      const po: string[] = ["urgent", "high", "medium", "low"];
      return po.indexOf(a.p) - po.indexOf(b.p);
    }
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border-default flex-shrink-0">
        <span className="text-xs text-text-secondary">
          Total: <strong className="text-text-primary">{tasks.length}</strong>
        </span>

        {/* View toggle */}
        <div className="flex items-center gap-0.5 rounded-lg border border-border-default p-0.5">
          {[
            { id: "kanban" as const, l: "Board", i: Layers },
            { id: "list" as const, l: "List", i: ListTodo },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px]"
              style={{
                backgroundColor: viewMode === m.id ? "rgba(201,169,110,0.13)" : "transparent",
                color: viewMode === m.id ? "#c9a96e" : "#71717a",
              }}
            >
              <m.i size={12} /> {m.l}
            </button>
          ))}
        </div>

        {/* Sort (list view only) */}
        {viewMode === "list" && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 rounded text-[11px] outline-none glass-input text-text-primary"
          >
            <option value="status">Sort: Status</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Title</option>
          </select>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Button><Filter size={12} /> Filter</Button>
          <Button primary onClick={() => setShowNew(true)}>
            <Plus size={12} /> New Task
          </Button>
        </div>
      </div>

      {/* Content */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No tasks yet"
          desc="Create your first task and let the orchestrator assign it to the best available worker. Tasks flow through Draft → Running → Completed."
          action="Create First Task"
          onAction={() => setShowNew(true)}
        />
      ) : viewMode === "kanban" ? (
        /* Kanban board */
        <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-4" style={{ minWidth: "max-content" }}>
            {KANBAN_COLUMNS.map((st) => {
              const s = ST[st];
              const Ic = getStatusIcon(s.icon);
              const ct = tasks.filter((t) => t.s === st);
              return (
                <div key={st} className="flex-shrink-0" style={{ width: 260 }}>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <Ic size={14} style={{ color: s.c }} />
                    <span className="text-sm font-semibold" style={{ color: s.c }}>{s.l}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: s.bg, color: s.c }}
                    >
                      {ct.length}
                    </span>
                  </div>
                  <div
                    className="space-y-2 min-h-[100px] p-1 rounded-lg"
                    style={{ backgroundColor: `${s.c}08` }}
                  >
                    {ct.map((t) => (
                      <TaskCard key={t.id} task={t} onClick={() => setSelectedTask(t)} onAction={handleAction} />
                    ))}
                    <button
                      onClick={() => setShowNew(true)}
                      className="w-full p-2 rounded-lg border border-dashed border-border-default text-sm flex items-center justify-center gap-1 text-text-muted hover:border-accent transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List view */
        <div className="flex-1 overflow-y-auto">
          <div className="min-w-full">
            <div className="flex items-center gap-3 px-6 py-2 border-b border-border-default text-[10px] uppercase tracking-wider text-text-muted bg-bg-base">
              <span className="w-8" />
              <span className="flex-1">Task</span>
              <span className="w-28">Status</span>
              <span className="w-20">Priority</span>
              <span className="w-28">Worker</span>
              <span className="w-20">Subtasks</span>
              <span className="w-24">Tags</span>
              <span className="w-8" />
            </div>
            {sortedTasks.map((t) => (
              <TaskListRow key={t.id} task={t} onClick={() => setSelectedTask(t)} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <NewTaskModal open={showNew} onClose={() => setShowNew(false)} />
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}
