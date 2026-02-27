"use client";

import { useState } from "react";
import {
  LayoutDashboard, Plus, Download, X, Clock,
  ListTodo, Timer, Cpu, DollarSign, TrendingUp, BarChart3,
  Activity, Bot, AlertTriangle, Calendar, Workflow,
  Edit3, MessageSquare, Sparkles, Code,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WIDGET_CATALOG } from "@/lib/data/widgets";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { WidgetContent } from "@/components/dashboard/widget-content";
import { WidgetCatalogModal } from "@/components/dashboard/widget-catalog-modal";

const ICON_MAP: Record<string, LucideIcon> = {
  ListTodo, Timer, Cpu, DollarSign, TrendingUp, BarChart3,
  Activity, Bot, AlertTriangle, Clock, Calendar, Workflow,
  Plus, Edit3, MessageSquare, Sparkles, Code,
};

export default function DashboardPage() {
  const [widgets, setWidgets] = useState(
    WIDGET_CATALOG.filter((w) => w.default).map((w) => w.id)
  );
  const [showCatalog, setShowCatalog] = useState(false);

  const removeWidget = (id: string) => setWidgets((ws) => ws.filter((w) => w !== id));
  const addWidget = (id: string) => setWidgets((ws) => [...ws, id]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-text-muted">{widgets.length} widgets active</span>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCatalog(true)}>
            <Plus size={14} /> Add Widget
          </Button>
          <Button onClick={() => console.log("Export dashboard PDF")}>
            <Download size={14} /> Export PDF
          </Button>
        </div>
      </div>

      {/* Widget grid or empty state */}
      {widgets.length === 0 ? (
        <EmptyState
          icon={LayoutDashboard}
          title="Your dashboard is empty"
          desc="Add widgets to build your personalized overview. Track tasks, monitor workers, and see project progress at a glance."
          action="Add Widget"
          onAction={() => setShowCatalog(true)}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {widgets.map((wId) => {
            const wDef = WIDGET_CATALOG.find((w) => w.id === wId);
            if (!wDef) return null;
            const Ic = ICON_MAP[wDef.icon] || Clock;
            return (
              <div
                key={wId}
                className="rounded-xl group glass-card"
              >
                <div className="flex items-center justify-between p-3 border-b border-border-default">
                  <div className="flex items-center gap-2">
                    <Ic size={14} className="text-accent" />
                    <span className="text-sm font-medium text-text-primary">{wDef.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1 rounded hover:bg-white/5"
                      title="Remove"
                      onClick={() => removeWidget(wId)}
                    >
                      <X size={12} className="text-text-muted" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <WidgetContent id={wId} />
                </div>
              </div>
            );
          })}

          {/* Add widget placeholder */}
          <button
            onClick={() => setShowCatalog(true)}
            className="rounded-xl border border-dashed border-border-default flex flex-col items-center justify-center py-8 transition-colors hover:border-accent"
          >
            <Plus size={24} className="text-text-muted" />
            <span className="text-sm mt-2 text-text-muted">Add Widget</span>
          </button>
        </div>
      )}

      {/* Widget Catalog Modal */}
      {showCatalog && (
        <WidgetCatalogModal
          activeWidgets={widgets}
          onAdd={addWidget}
          onClose={() => setShowCatalog(false)}
        />
      )}
    </div>
  );
}
