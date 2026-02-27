"use client";

import { useProjects, useWorkers, useTasks, useNotes } from "@/lib/hooks";
import { ST } from "@/lib/constants/status";
import { getStatusIcon } from "@/lib/constants/icons";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { CheckCircle2, Pin } from "lucide-react";

interface BlockContentProps {
  blockId: string;
}

export function BlockContent({ blockId }: BlockContentProps) {
  const { projects } = useProjects();
  const { workers } = useWorkers();
  const { tasks } = useTasks();
  const { notes } = useNotes();

  switch (blockId) {
    case "exec-summary": {
      const completed = tasks.filter((t) => t.s === "completed").length;
      const blocked = tasks.filter((t) => t.s === "awaiting_input" || t.s === "failed").length;
      const running = tasks.filter((t) => t.s === "running").length;
      if (tasks.length === 0) {
        return <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No tasks yet. Create tasks to see a summary.</p>;
      }
      return (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {completed} task{completed !== 1 ? "s" : ""} completed, {running} running, {blocked} blocked.
          {projects.length > 0 && ` Across ${projects.length} project${projects.length !== 1 ? "s" : ""}.`}
        </p>
      );
    }

    case "task-stats": {
      const stats = [
        { l: "Completed", v: tasks.filter((t) => t.s === "completed").length, c: "var(--color-accent)" },
        { l: "Running", v: tasks.filter((t) => t.s === "running").length, c: "var(--color-accent)" },
        { l: "Blocked", v: tasks.filter((t) => t.s === "awaiting_input").length, c: "var(--color-accent)" },
        { l: "Failed", v: tasks.filter((t) => t.s === "failed").length, c: "var(--color-error)" },
      ];
      return (
        <div className="grid grid-cols-4 gap-3">
          {stats.map((s) => (
            <div
              key={s.l}
              className="p-2 rounded"
              style={{ backgroundColor: "var(--color-bg-deep)" }}
            >
              <span className="text-[10px] block" style={{ color: "var(--color-text-muted)" }}>{s.l}</span>
              <span className="text-2xl font-bold" style={{ color: s.c }}>{s.v}</span>
            </div>
          ))}
        </div>
      );
    }

    case "per-project":
      if (projects.length === 0) {
        return <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No projects yet.</p>;
      }
      return (
        <div className="space-y-2">
          {projects.map((p) => {
            const pct = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0;
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: p.color }} />
                <span className="text-xs w-36" style={{ color: "var(--color-text-primary)" }}>{p.name}</span>
                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "var(--color-bg-deep)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: p.color }} />
                </div>
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      );

    case "worker-perf": {
      const aiWorkers = workers.filter((w) => !w.isHuman);
      if (aiWorkers.length === 0) {
        return <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No AI workers configured.</p>;
      }
      return (
        <div className="space-y-2">
          {aiWorkers.map((w) => {
            const total = w.done + w.active;
            const rate = total > 0 ? Math.round((w.done / total) * 100) : 0;
            return (
              <div key={w.id} className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: "var(--color-bg-deep)" }}>
                <Avatar type={w.type} size={24} role={w.role} />
                <span className="text-xs w-28 truncate" style={{ color: "var(--color-text-primary)" }}>{w.name}</span>
                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "var(--color-bg-card)" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${rate}%`, backgroundColor: rate > 70 ? "var(--color-accent)" : "var(--color-error)" }}
                  />
                </div>
                <span className="text-xs w-10 text-right" style={{ color: "var(--color-accent)" }}>{rate}%</span>
              </div>
            );
          })}
          <div className="flex justify-between pt-2 mt-1 border-t" style={{ borderColor: "var(--color-border-default)" }}>
            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Completion rate</span>
          </div>
        </div>
      );
    }

    case "token-cost":
      return (
        <div className="py-4 text-center">
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Token cost tracking starts when AI workers process tasks.
          </p>
        </div>
      );

    case "completed-list": {
      const completed = tasks.filter((t) => t.s === "completed");
      if (completed.length === 0) {
        return <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No completed tasks in this period.</p>;
      }
      return (
        <div className="space-y-1">
          {completed.map((t) => {
            const w = workers.find((x) => x.id === t.w);
            return (
              <div key={t.id} className="flex items-center gap-2 p-2 rounded" style={{ backgroundColor: "var(--color-bg-deep)" }}>
                <CheckCircle2 size={14} style={{ color: "var(--color-accent)" }} />
                <span className="text-xs flex-1 truncate" style={{ color: "var(--color-text-primary)" }}>{t.title}</span>
                {w && <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{w.name}</span>}
              </div>
            );
          })}
        </div>
      );
    }

    case "blocked-analysis": {
      const blocked = tasks.filter((t) => t.s === "awaiting_input" || t.s === "failed");
      if (blocked.length === 0) {
        return <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No blocked or failed tasks.</p>;
      }
      return (
        <div className="space-y-2">
          {blocked.map((t) => {
            const sc = ST[t.s];
            const Icon = getStatusIcon(sc.icon);
            return (
              <div key={t.id} className="p-3 rounded" style={{ backgroundColor: "var(--color-bg-deep)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={12} style={{ color: sc.c }} />
                  <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>{t.title}</span>
                  <Badge color={sc.c} bg={sc.bg} small>{sc.l}</Badge>
                </div>
                <p className="text-[11px] pl-5" style={{ color: t.block ? "var(--color-text-secondary)" : "var(--color-text-muted)" }}>
                  {t.block || "No blocker details."}
                </p>
              </div>
            );
          })}
        </div>
      );
    }

    case "recommendations":
      return (
        <div className="py-4 text-center">
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            AI-generated recommendations will appear once the orchestrator analyzes your tasks.
          </p>
        </div>
      );

    case "timeline":
      return (
        <div className="py-4 text-center">
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Timeline events will appear as workers process tasks.
          </p>
        </div>
      );

    case "notes-summary":
      if (notes.length === 0) {
        return <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No notes yet.</p>;
      }
      return (
        <div className="space-y-2">
          {notes.slice(0, 3).map((n) => (
            <div key={n.id} className="p-2 rounded" style={{ backgroundColor: "var(--color-bg-deep)" }}>
              <div className="flex items-center gap-2 mb-0.5">
                {n.pinned && <Pin size={10} style={{ color: "var(--color-accent)" }} />}
                <span className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>{n.title}</span>
                {n.proj && <Badge color="#c9a96e" small>{n.proj}</Badge>}
              </div>
              <p className="text-[11px] line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>
                {n.content.split("\n").filter((l) => !l.startsWith("#") && l.trim()).slice(0, 2).join(" ")}
              </p>
            </div>
          ))}
        </div>
      );

    case "custom-block":
      return (
        <div>
          <textarea
            className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none resize-none mb-2"
            rows={3}
            style={{ backgroundColor: "var(--color-bg-deep)", borderColor: "var(--color-border-default)", color: "var(--color-text-primary)" }}
            defaultValue={`// Custom JS — orchestria.tasks, orchestria.workers\nconst blocked = orchestria.tasks.filter(t => t.status === 'blocked');\nreturn { value: blocked.length, label: 'Blocked' };`}
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Sandboxed execution</span>
            <button className="px-3 py-1 rounded text-[10px]" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-fg)" }}>Run</button>
          </div>
        </div>
      );

    default:
      return <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Content will be generated.</p>;
  }
}
