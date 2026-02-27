"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/lib/hooks";

const EVENTS = [
  { id: "task_done", l: "Task Completed", d: "When any worker finishes a task" },
  { id: "review", l: "Review Needed", d: "When a task enters review status" },
  { id: "blocked", l: "Task Blocked", d: "When a task is stuck or encounters an error" },
  { id: "plan_ready", l: "Plan Ready", d: "When the AI Planner generates a new plan" },
  { id: "briefing", l: "Daily Briefing", d: "Morning summary of overnight progress" },
  { id: "token_limit", l: "Token Limit Alert", d: "When usage approaches configured limits" },
];

const DEFAULTS: Record<string, boolean> = {
  task_done: true,
  review: true,
  blocked: true,
  plan_ready: false,
  briefing: true,
  token_limit: true,
};

export function NotificationsTab() {
  const { settings, loading, update } = useSettings();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(DEFAULTS);

  // Initialize from saved settings
  useEffect(() => {
    if (!loading && settings.notifications) {
      setEnabled((prev) => ({ ...prev, ...settings.notifications }));
    }
  }, [loading, settings.notifications]);

  function toggle(id: string) {
    const next = { ...enabled, [id]: !enabled[id] };
    setEnabled(next);
    update("notifications", next);
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
        Notifications
      </h2>
      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        Choose which events trigger notifications.
      </p>

      <div className="space-y-2">
        {EVENTS.map((ev) => {
          const on = enabled[ev.id] ?? false;
          return (
            <div
              key={ev.id}
              className="flex items-center justify-between p-4 rounded-xl border"
              style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}
            >
              <div>
                <span className="text-sm font-medium block" style={{ color: "var(--color-text-primary)" }}>
                  {ev.l}
                </span>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                  {ev.d}
                </span>
              </div>
              <button
                onClick={() => toggle(ev.id)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{ backgroundColor: on ? "var(--color-accent)" : "var(--color-bg-elevated)" }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
                  style={{
                    backgroundColor: on ? "var(--color-accent-fg)" : "var(--color-text-muted)",
                    transform: on ? "translateX(22px)" : "translateX(2px)",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
