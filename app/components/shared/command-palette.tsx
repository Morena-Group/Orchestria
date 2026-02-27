"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, ListTodo, Bot, MessageSquare, Workflow,
  FileText, BarChart3, HardDrive, Settings, Search, Plus,
  Edit3, Sparkles, FolderOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ST } from "@/lib/constants/status";
import { PRI } from "@/lib/constants/status";
import { useProjectContext } from "@/lib/context/project-context";
import { useTasks, useWorkers, useProjects } from "@/lib/hooks";

interface PaletteItem {
  id: string;
  cat: string;
  label: string;
  icon: LucideIcon;
  desc: string;
  href: string;
}

const CAT_LABELS: Record<string, string> = {
  all: "All",
  nav: "Navigate",
  task: "Tasks",
  worker: "Workers",
  action: "Actions",
  project: "Projects",
};

function buildItems(tasks: import("@/lib/types").Task[], workers: import("@/lib/types").Worker[], projects: import("@/lib/types").Project[]): PaletteItem[] {
  const navItems: PaletteItem[] = [
    { id: "nav-dash", cat: "nav", label: "Go to Dashboard", icon: LayoutDashboard, desc: "Overview & widgets", href: "/dashboard" },
    { id: "nav-tasks", cat: "nav", label: "Go to My Tasks", icon: ListTodo, desc: "Kanban board", href: "/tasks" },
    { id: "nav-workers", cat: "nav", label: "Go to Workers", icon: Bot, desc: "AI agents & humans", href: "/workers" },
    { id: "nav-chat", cat: "nav", label: "Go to Chat", icon: MessageSquare, desc: "Orchestrator chat", href: "/chat" },
    { id: "nav-planner", cat: "nav", label: "Go to Master Planner", icon: Workflow, desc: "Pyramid DAG", href: "/planner" },
    { id: "nav-notes", cat: "nav", label: "Go to Notes", icon: FileText, desc: "Notes & ideas", href: "/notes" },
    { id: "nav-brief", cat: "nav", label: "Go to Briefings", icon: BarChart3, desc: "Reports", href: "/briefings" },
    { id: "nav-storage", cat: "nav", label: "Go to Storage", icon: HardDrive, desc: "Files & artifacts", href: "/storage" },
    { id: "nav-settings", cat: "nav", label: "Go to Settings", icon: Settings, desc: "Profile, API keys, plugins", href: "/settings" },
  ];

  const taskItems: PaletteItem[] = tasks.map((t) => ({
    id: `task-${t.id}`,
    cat: "task",
    label: t.title,
    icon: ListTodo,
    desc: `${ST[t.s].l} \u2022 ${PRI[t.p].l} \u2022 ${t.tags.join(", ")}`,
    href: "/tasks",
  }));

  const workerItems: PaletteItem[] = workers.map((w) => ({
    id: `worker-${w.id}`,
    cat: "worker",
    label: w.name,
    icon: Bot,
    desc: `${w.isHuman ? "Human" : w.model} \u2022 ${w.active} active`,
    href: "/workers",
  }));

  const actionItems: PaletteItem[] = [
    { id: "act-newtask", cat: "action", label: "Create New Task", icon: Plus, desc: "Open new task form", href: "/tasks" },
    { id: "act-newnote", cat: "action", label: "Create New Note", icon: Edit3, desc: "Start a new note", href: "/notes" },
    { id: "act-newplan", cat: "action", label: "Create New Plan", icon: Workflow, desc: "Start a master plan", href: "/planner" },
    { id: "act-brief", cat: "action", label: "Generate Briefing", icon: Sparkles, desc: "Generate a new report", href: "/briefings" },
  ];

  const projectItems: PaletteItem[] = projects.map((p) => ({
    id: `proj-${p.id}`,
    cat: "project",
    label: p.name,
    icon: FolderOpen,
    desc: `${p.done}/${p.total} tasks done`,
    href: "/dashboard",
  }));

  return [...navItems, ...taskItems, ...workerItems, ...actionItems, ...projectItems];
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { setActiveProjectId } = useProjectContext();
  const { tasks } = useTasks();
  const { workers } = useWorkers();
  const { projects } = useProjects();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [sel, setSel] = useState(0);

  if (!open) return null;

  const items = buildItems(tasks, workers, projects);

  const filtered = items.filter((i) => {
    if (cat !== "all" && i.cat !== cat) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return i.label.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q);
  });

  const runItem = (item: PaletteItem) => {
    // Handle project switching
    if (item.cat === "project") {
      const projId = item.id.replace("proj-", "");
      setActiveProjectId(projId);
    }
    // Log action items
    if (item.cat === "action") {
      console.log("Command palette action:", item.label);
    }
    router.push(item.href);
    onClose();
    setQuery("");
    setCat("all");
    setSel(0);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-[15vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-border-default bg-bg-deep overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
          <Search size={18} className="text-text-muted" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSel(0); }}
            placeholder="Search tasks, navigate, run actions..."
            className="flex-1 bg-transparent text-sm outline-none text-text-primary placeholder:text-text-muted"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, Math.min(filtered.length, 15) - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
              if (e.key === "Enter" && filtered[sel]) { e.preventDefault(); runItem(filtered[sel]); }
              if (e.key === "Escape") onClose();
            }}
          />
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-border-default text-text-muted">
            ESC
          </span>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-border-default overflow-x-auto">
          {Object.entries(CAT_LABELS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => { setCat(k); setSel(0); }}
              className="px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap transition-all duration-150"
              style={{
                backgroundColor: cat === k ? "rgba(201,169,110,0.13)" : "transparent",
                color: cat === k ? "#d4b87e" : "#71717a",
                border: `1px solid ${cat === k ? "#c9a96e" : "rgba(200,169,110,0.1)"}`,
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-8 text-center">
              <Search size={24} className="mx-auto mb-2 text-text-muted" />
              <p className="text-xs text-text-muted">No results for &quot;{query}&quot;</p>
            </div>
          ) : (
            filtered.slice(0, 15).map((item, i) => {
              const Ic = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => runItem(item)}
                  onMouseEnter={() => setSel(i)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer"
                  style={{ backgroundColor: sel === i ? "rgba(201,169,110,0.06)" : "transparent" }}
                >
                  <Ic size={16} style={{ color: sel === i ? "#c9a96e" : "#71717a" }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm block truncate text-text-primary">{item.label}</span>
                    <span className="text-[10px] block truncate text-text-muted">{item.desc}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-bg-card text-text-muted">
                    {CAT_LABELS[item.cat]}
                  </span>
                  {sel === i && <span className="text-[10px] text-text-muted">\u21B5</span>}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border-default flex items-center justify-between">
          <span className="text-[10px] text-text-muted">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-text-muted">\u2191\u2193 navigate</span>
            <span className="text-[10px] text-text-muted">\u21B5 select</span>
            <span className="text-[10px] text-text-muted">esc close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
