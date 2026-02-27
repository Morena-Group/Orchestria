"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface TabViewProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant: "horizontal" | "vertical";
  children: ReactNode;
}

export function TabView({ tabs, activeTab, onTabChange, variant, children }: TabViewProps) {
  if (variant === "vertical") {
    return (
      <div className="flex-1 flex overflow-hidden">
        <div
          className="w-52 flex-shrink-0 border-r p-4 space-y-1 overflow-y-auto"
          style={{ borderColor: "var(--color-border-default)" }}
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left"
                style={{
                  backgroundColor: active ? "rgba(201, 169, 110, 0.08)" : "transparent",
                  color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
                }}
              >
                {Icon && <Icon size={16} />}
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    );
  }

  // horizontal
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-1 px-6 pt-4 pb-0 flex-shrink-0">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm transition-colors"
              style={{
                backgroundColor: active ? "var(--color-bg-card)" : "transparent",
                color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
                borderBottom: active ? "2px solid var(--color-accent)" : "2px solid transparent",
              }}
            >
              {Icon && <Icon size={14} />}
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        className="flex-1 flex overflow-hidden border-t"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        {children}
      </div>
    </div>
  );
}
