"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Search, Bell, ChevronRight, CheckCircle2, AlertTriangle,
  Eye, Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PROJECTS } from "@/lib/data/projects";
import { NOTIFICATIONS as INITIAL_NOTIFICATIONS } from "@/lib/data/notifications";
import { INSTALLED_PLUGINS } from "@/lib/data/plugins";

const NOTIF_ICONS: Record<string, LucideIcon> = {
  CheckCircle2,
  AlertTriangle,
  Eye,
  Workflow,
};

const LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tasks": "My Tasks",
  "/workers": "Workers",
  "/chat": "Orchestrator Chat",
  "/planner": "Master Planner",
  "/notes": "Notes",
  "/briefings": "Briefings",
  "/storage": "Storage",
  "/settings": "Settings",
};

interface TopBarProps {
  onOpenCmd?: () => void;
}

export function TopBar({ onOpenCmd }: TopBarProps) {
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read).length;

  // Get label for current route
  const pluginMatch = pathname.match(/^\/plugins\/(.+)$/);
  const pluginLabel = pluginMatch
    ? INSTALLED_PLUGINS.find((p) => p.id === pluginMatch[1])?.name
    : null;
  const label = pluginLabel || LABELS[pathname] || "Dashboard";

  // Active project (default for now)
  const project = PROJECTS[0];

  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="h-14 flex items-center justify-between px-6 border-b border-border-default glass-topbar">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        {project && (
          <>
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: project.color }}
            />
            <span className="text-sm font-medium text-text-primary">
              {project.name}
            </span>
            <ChevronRight size={14} className="text-text-muted" />
          </>
        )}
        <span className="text-sm font-semibold text-text-primary">{label}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button onClick={onOpenCmd} className="relative flex items-center gap-2 pl-8 pr-3 py-1.5 rounded-lg text-sm glass-input text-text-muted w-[220px]">
          <Search size={16} className="absolute left-2.5 text-text-muted" />
          Search...
          <span className="ml-auto text-[10px] px-1 py-0.5 rounded border border-border-default text-text-muted">
            \u2318K
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-lg"
            style={{ color: showNotif ? "#c9a96e" : "#a1a1aa" }}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            )}
          </button>

          {showNotif && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotif(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-96 rounded-xl border border-border-default bg-bg-deep overflow-hidden z-50 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">
                      Notifications
                    </span>
                    {unread > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-accent-fg">
                        {unread}
                      </span>
                    )}
                  </div>
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-accent-hover"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <div className="py-8 text-center">
                      <Bell size={24} className="mx-auto mb-2 text-text-muted" />
                      <p className="text-xs text-text-muted">No notifications yet</p>
                    </div>
                  ) : (
                    notifs.map((n) => {
                      const Ic = NOTIF_ICONS[n.icon] || Bell;
                      return (
                        <div
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          className="flex gap-3 px-4 py-3 border-b border-border-default cursor-pointer"
                          style={{
                            backgroundColor: !n.read
                              ? "rgba(201,169,110,0.02)"
                              : "transparent",
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${n.color}15` }}
                          >
                            <Ic size={16} style={{ color: n.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-text-primary">
                                {n.title}
                              </span>
                              {!n.read && (
                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                              )}
                            </div>
                            <p className="text-[11px] mt-0.5 line-clamp-2 text-text-secondary">
                              {n.desc}
                            </p>
                            <span className="text-[10px] mt-0.5 block text-text-muted">
                              {n.time}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="px-4 py-2.5 border-t border-border-default text-center">
                  <button className="text-xs text-accent-hover">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-bg-elevated text-text-secondary">
          M
        </div>
      </div>
    </div>
  );
}
