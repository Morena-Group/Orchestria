"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ListTodo, Bot, MessageSquare, Workflow,
  FileText, BarChart3, HardDrive, Settings, Zap,
  ChevronDown, ChevronRight, ChevronLeft, Plus,
} from "lucide-react";
import { useProjectContext } from "@/lib/context/project-context";
import { useProjects, usePlugins } from "@/lib/hooks";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "My Tasks", href: "/tasks", icon: ListTodo },
  { id: "workers", label: "Workers", href: "/workers", icon: Bot },
  { id: "chat", label: "Chat", href: "/chat", icon: MessageSquare },
  { id: "planner", label: "Master Planner", href: "/planner", icon: Workflow },
  { id: "notes", label: "Notes", href: "/notes", icon: FileText },
  { id: "briefings", label: "Briefings", href: "/briefings", icon: BarChart3 },
  { id: "storage", label: "Storage", href: "/storage", icon: HardDrive },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeProjectId, setActiveProjectId } = useProjectContext();
  const { projects } = useProjects();
  const { plugins } = usePlugins();
  const [collapsed, setCollapsed] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  return (
    <div
      className="h-full flex flex-col border-r border-border-subtle glass-sidebar transition-[width] duration-200"
      style={{ width: collapsed ? 60 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border-subtle">
        {!collapsed && (
          <>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent">
              <Zap size={18} className="text-accent-fg" />
            </div>
            <span className="font-bold text-lg text-text-primary">Orchestria</span>
          </>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1 rounded text-text-secondary"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                collapsed ? "justify-center" : ""
              }`}
              title={collapsed ? item.label : undefined}
              style={{
                color: isActive ? "#c9a96e" : "#a1a1aa",
                backgroundColor: isActive ? "#2a2318" : "transparent",
                borderLeft: isActive ? "2px solid #c9a96e" : "2px solid transparent",
              }}
            >
              <Icon size={18} style={{ opacity: isActive ? 1 : 0.6 }} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Plugin tabs */}
        {plugins.length > 0 && (
          <>
            {!collapsed && (
              <div className="mt-5 mb-1 px-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-text-faint">
                  Plugins
                </span>
              </div>
            )}
            {plugins.map((plg) => {
              const isActive = pathname === `/plugins/${plg.id}`;
              return (
                <Link
                  key={plg.id}
                  href={`/plugins/${plg.id}`}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                    collapsed ? "justify-center" : ""
                  }`}
                  title={collapsed ? plg.name : undefined}
                  style={{
                    color: isActive ? "#c9a96e" : "#a1a1aa",
                    backgroundColor: isActive ? "#2a2318" : "transparent",
                    borderLeft: isActive ? "2px solid #c9a96e" : "2px solid transparent",
                  }}
                >
                  <span className="text-base">{plg.icon}</span>
                  {!collapsed && <span className="truncate">{plg.name}</span>}
                  {!collapsed && plg.items > 0 && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-bg-elevated text-text-secondary">
                      {plg.items}
                    </span>
                  )}
                </Link>
              );
            })}
          </>
        )}

        {/* Projects */}
        {!collapsed && (
          <div className="mt-5 px-4">
            <button
              onClick={() => setProjectsExpanded(!projectsExpanded)}
              className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest mb-2 text-text-faint"
            >
              {projectsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Projects
            </button>
            {projectsExpanded &&
              projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveProjectId(p.id);
                    router.push("/dashboard");
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mb-0.5 transition-all duration-150 text-left"
                  style={{
                    color: activeProjectId === p.id ? "#ededef" : "#a1a1aa",
                    backgroundColor: activeProjectId === p.id ? "#1c1f2e" : "transparent",
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{
                      backgroundColor: activeProjectId === p.id ? "#c9a96e" : "#52525b",
                    }}
                  />
                  <span className="truncate">{p.name}</span>
                  <span className="ml-auto text-[11px] text-text-muted">
                    {p.done}/{p.total}
                  </span>
                </button>
              ))}
            <button
              onClick={() => console.log("New Project clicked")}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md mt-1 text-text-muted"
            >
              <Plus size={14} /> New Project
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
