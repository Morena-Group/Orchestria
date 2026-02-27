"use client";

import { PLAN_TEMPLATES } from "@/lib/data/planner";

export function PlannerTemplatesStrip() {
  return (
    <div
      className="px-4 py-2 border-b flex items-center gap-2 overflow-x-auto flex-shrink-0"
      style={{
        borderColor: "var(--color-border-default)",
        backgroundColor: "var(--color-bg-base)",
      }}
    >
      <span
        className="text-[10px] uppercase tracking-wider flex-shrink-0"
        style={{ color: "var(--color-text-muted)" }}
      >
        New from:
      </span>
      {PLAN_TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => console.log("Select template:", t.id, t.name)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border whitespace-nowrap flex-shrink-0 transition-colors hover:border-accent"
          style={{
            borderColor: "var(--color-border-default)",
            backgroundColor: "var(--color-bg-card)",
          }}
        >
          <span>{t.icon}</span>
          <div className="text-left">
            <span
              className="text-xs block"
              style={{ color: "var(--color-text-primary)" }}
            >
              {t.name}
            </span>
            <span
              className="text-[9px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t.desc}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
