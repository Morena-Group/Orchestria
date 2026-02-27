"use client";

import { useState } from "react";
import {
  ChevronDown, ChevronRight, X,
  ListTodo, Timer, Cpu, DollarSign, TrendingUp, BarChart3,
  Activity, Bot, AlertTriangle, Clock, Calendar, Workflow,
  Plus, Edit3, MessageSquare, Sparkles, Code,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WIDGET_CATALOG } from "@/lib/data/widgets";
import { Badge } from "@/components/ui/badge";

const ICON_MAP: Record<string, LucideIcon> = {
  ListTodo, Timer, Cpu, DollarSign, TrendingUp, BarChart3,
  Activity, Bot, AlertTriangle, Clock, Calendar, Workflow,
  Plus, Edit3, MessageSquare, Sparkles, Code,
};

interface WidgetCatalogModalProps {
  activeWidgets: string[];
  onAdd: (id: string) => void;
  onClose: () => void;
}

export function WidgetCatalogModal({ activeWidgets, onAdd, onClose }: WidgetCatalogModalProps) {
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const cats = [...new Set(WIDGET_CATALOG.map((w) => w.cat))];

  const toggleCat = (cat: string) =>
    setExpandedCats((prev) => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="rounded-xl border border-border-default bg-bg-deep w-full max-w-lg max-h-[70vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <h3 className="text-lg font-semibold text-text-primary">Add Widget</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/5 text-text-secondary"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cats.map((cat) => {
            const isOpen = expandedCats[cat] || false;
            const catWidgets = WIDGET_CATALOG.filter((w) => w.cat === cat);
            const addedCount = catWidgets.filter((w) => activeWidgets.includes(w.id)).length;
            return (
              <div key={cat} className="rounded-lg border border-border-default overflow-hidden">
                <button
                  onClick={() => toggleCat(cat)}
                  className="w-full flex items-center gap-2 p-3 bg-bg-card"
                >
                  {isOpen ? (
                    <ChevronDown size={14} className="text-text-secondary" />
                  ) : (
                    <ChevronRight size={14} className="text-text-secondary" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wider flex-1 text-left text-text-muted">
                    {cat}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-bg-deep text-text-secondary">
                    {addedCount}/{catWidgets.length}
                  </span>
                </button>
                {isOpen && (
                  <div className="p-2 space-y-1">
                    {catWidgets.map((w) => {
                      const Ic = ICON_MAP[w.icon] || Clock;
                      const added = activeWidgets.includes(w.id);
                      return (
                        <div
                          key={w.id}
                          className="flex items-center gap-3 p-3 rounded-lg"
                          style={{
                            backgroundColor: added
                              ? "rgba(201,169,110,0.06)"
                              : "var(--color-bg-deep)",
                          }}
                        >
                          <Ic size={16} style={{ color: added ? "#c9a96e" : "#71717a" }} />
                          <div className="flex-1">
                            <span className="text-sm text-text-primary">{w.name}</span>
                            <p className="text-[10px] text-text-muted">{w.desc}</p>
                          </div>
                          {added ? (
                            <Badge color="#c9a96e" small>Added</Badge>
                          ) : (
                            <button
                              onClick={() => onAdd(w.id)}
                              className="px-3 py-1 rounded-lg text-xs bg-accent text-accent-fg"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
