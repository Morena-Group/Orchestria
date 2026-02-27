"use client";

import { PROJECTS } from "@/lib/data/projects";
import { WORKERS } from "@/lib/data/workers";
import { TASKS } from "@/lib/data/tasks";
import { NOTES_DATA } from "@/lib/data/notes";
import { ST } from "@/lib/constants/status";
import { getStatusIcon } from "@/lib/constants/icons";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { CheckCircle2, Pin } from "lucide-react";

interface BlockContentProps {
  blockId: string;
}

export function BlockContent({ blockId }: BlockContentProps) {
  switch (blockId) {
    case "exec-summary":
      return (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Strong progress across projects. 5 tasks completed, 1 blocked (API
          docs awaiting credentials). Auth module nearing completion — recommend
          starting Stripe integration.
        </p>
      );

    case "task-stats":
      return (
        <div className="grid grid-cols-4 gap-3">
          {[
            { l: "Completed", v: "5", c: "var(--color-accent)" },
            { l: "Running", v: "3", c: "var(--color-accent)" },
            { l: "Blocked", v: "1", c: "var(--color-accent)" },
            { l: "Failed", v: "0", c: "var(--color-error)" },
          ].map((s) => (
            <div
              key={s.l}
              className="p-2 rounded"
              style={{ backgroundColor: "var(--color-bg-deep)" }}
            >
              <span
                className="text-[10px] block"
                style={{ color: "var(--color-text-muted)" }}
              >
                {s.l}
              </span>
              <span className="text-2xl font-bold" style={{ color: s.c }}>
                {s.v}
              </span>
            </div>
          ))}
        </div>
      );

    case "per-project":
      return (
        <div className="space-y-2">
          {PROJECTS.map((p) => {
            const pct = Math.round((p.done / p.total) * 100);
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: p.color }}
                />
                <span
                  className="text-xs w-36"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {p.name}
                </span>
                <div
                  className="flex-1 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-bg-deep)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: p.color }}
                  />
                </div>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      );

    case "worker-perf": {
      const aiWorkers = WORKERS.filter((w) => !w.isHuman);
      const rates = [92, 87, 78, 95];
      const costs = ["$18.00", "$4.00", "$2.00", "$6.50"];
      return (
        <div className="space-y-2">
          {aiWorkers.map((w, i) => {
            const rate = rates[i] ?? 80;
            const cost = costs[i] ?? "$0";
            return (
              <div
                key={w.id}
                className="flex items-center gap-3 p-2 rounded"
                style={{ backgroundColor: "var(--color-bg-deep)" }}
              >
                <Avatar type={w.type} size={24} role={w.role} />
                <span
                  className="text-xs w-28 truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {w.name}
                </span>
                <div
                  className="flex-1 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-bg-card)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${rate}%`,
                      backgroundColor:
                        rate > 85
                          ? "var(--color-accent)"
                          : rate > 70
                            ? "var(--color-accent)"
                            : "var(--color-error)",
                    }}
                  />
                </div>
                <span
                  className="text-xs w-10 text-right"
                  style={{ color: "var(--color-accent)" }}
                >
                  {rate}%
                </span>
                <span
                  className="text-xs w-14 text-right"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {cost}
                </span>
              </div>
            );
          })}
          <div
            className="flex justify-between pt-2 mt-1 border-t"
            style={{ borderColor: "var(--color-border-default)" }}
          >
            <span
              className="text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Success rate
            </span>
            <span
              className="text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Cost this period
            </span>
          </div>
        </div>
      );
    }

    case "token-cost":
      return (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { n: "Claude", t: "1.2M", c: "$18.00" },
              { n: "Gemini", t: "800K", c: "$4.00" },
              { n: "GPT-4o", t: "200K", c: "$2.00" },
            ].map((u) => (
              <div
                key={u.n}
                className="p-2 rounded"
                style={{ backgroundColor: "var(--color-bg-deep)" }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {u.n}
                  </span>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {u.t}
                </span>
                <span
                  className="text-xs block"
                  style={{ color: "var(--color-accent)" }}
                >
                  {u.c}
                </span>
              </div>
            ))}
          </div>
          <div
            className="flex justify-between p-2 rounded"
            style={{ backgroundColor: "var(--color-bg-deep)" }}
          >
            <span
              className="text-sm"
              style={{ color: "var(--color-text-primary)" }}
            >
              Total Spend
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--color-accent)" }}
            >
              $24.00
            </span>
          </div>
        </div>
      );

    case "completed-list": {
      const completed = TASKS.filter((t) => t.s === "completed");
      if (completed.length === 0) {
        return (
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            No completed tasks in this period.
          </p>
        );
      }
      return (
        <div className="space-y-1">
          {completed.map((t) => {
            const w = WORKERS.find((x) => x.id === t.w);
            return (
              <div
                key={t.id}
                className="flex items-center gap-2 p-2 rounded"
                style={{ backgroundColor: "var(--color-bg-deep)" }}
              >
                <CheckCircle2
                  size={14}
                  style={{ color: "var(--color-accent)" }}
                />
                <span
                  className="text-xs flex-1 truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {t.title}
                </span>
                {w && (
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {w.name}
                  </span>
                )}
                <span
                  className="text-[10px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  2h ago
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    case "blocked-analysis": {
      const blocked = TASKS.filter(
        (t) => t.s === "awaiting_input" || t.s === "failed"
      );
      return (
        <div className="space-y-2">
          {blocked.map((t) => {
            const sc = ST[t.s];
            const Icon = getStatusIcon(sc.icon);
            return (
              <div
                key={t.id}
                className="p-3 rounded"
                style={{ backgroundColor: "var(--color-bg-deep)" }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={12} style={{ color: sc.c }} />
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t.title}
                  </span>
                  <Badge color={sc.c} bg={sc.bg} small>
                    {sc.l}
                  </Badge>
                </div>
                <p
                  className="text-[11px] pl-5"
                  style={{
                    color: t.block
                      ? "var(--color-text-secondary)"
                      : "var(--color-text-muted)",
                  }}
                >
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
        <div className="space-y-2">
          {[
            "Unblock API docs — provide test API key",
            "Start Stripe integration — deps met",
            "Schedule security audit next week",
          ].map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded"
              style={{ backgroundColor: "var(--color-bg-deep)" }}
            >
              <span
                className="text-sm"
                style={{ color: "var(--color-text-primary)" }}
              >
                {r}
              </span>
              <button
                className="px-2 py-1 rounded text-[10px] ml-2 flex-shrink-0"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-fg)",
                }}
              >
                Create Task
              </button>
            </div>
          ))}
        </div>
      );

    case "timeline":
      return (
        <div className="relative">
          <div
            className="absolute left-3 top-0 bottom-0 w-px"
            style={{ backgroundColor: "var(--color-border-default)" }}
          />
          {[
            { t: "Today 14:00", e: "Security audit started" },
            { t: "Today 11:00", e: "Kanban moved to Review" },
            { t: "Today 10:30", e: "DB schema completed" },
            { t: "Yesterday", e: "Competitor research started" },
            { t: "Feb 23", e: "Project created" },
          ].map((ev, i) => (
            <div key={i} className="flex gap-3 py-1.5 relative">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center z-10 flex-shrink-0"
                style={{
                  backgroundColor: "var(--color-bg-deep)",
                  border: "2px solid var(--color-accent)",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              </div>
              <div className="pt-0.5">
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {ev.e}
                </span>
                <span
                  className="text-[10px] block"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {ev.t}
                </span>
              </div>
            </div>
          ))}
        </div>
      );

    case "notes-summary":
      return (
        <div className="space-y-2">
          {NOTES_DATA.slice(0, 3).map((n) => (
            <div
              key={n.id}
              className="p-2 rounded"
              style={{ backgroundColor: "var(--color-bg-deep)" }}
            >
              <div className="flex items-center gap-2 mb-0.5">
                {n.pinned && (
                  <Pin size={10} style={{ color: "var(--color-accent)" }} />
                )}
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {n.title}
                </span>
                <Badge color="#c9a96e" small>
                  {n.proj}
                </Badge>
              </div>
              <p
                className="text-[11px] line-clamp-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {n.content
                  .split("\n")
                  .filter((l) => !l.startsWith("#") && l.trim())
                  .slice(0, 2)
                  .join(" ")}
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
            style={{
              backgroundColor: "var(--color-bg-deep)",
              borderColor: "var(--color-border-default)",
              color: "var(--color-text-primary)",
            }}
            defaultValue={`// Custom JS — orchestria.tasks, orchestria.workers\nconst blocked = orchestria.tasks.filter(t => t.status === 'blocked');\nreturn { value: blocked.length, label: 'Blocked' };`}
          />
          <div className="flex items-center justify-between">
            <span
              className="text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Sandboxed execution
            </span>
            <button
              className="px-3 py-1 rounded text-[10px]"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-fg)",
              }}
            >
              Run
            </button>
          </div>
        </div>
      );

    default:
      return (
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Content will be generated.
        </p>
      );
  }
}
