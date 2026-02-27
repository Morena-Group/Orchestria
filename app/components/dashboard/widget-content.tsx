"use client";

import { useState } from "react";
import {
  CheckCircle2, Plus, Edit3, AlertTriangle, Clock,
} from "lucide-react";
import { ST } from "@/lib/constants/status";
import { useTasks, useWorkers, useProjects, useNotes, useChats } from "@/lib/hooks";
import { Avatar } from "@/components/ui/avatar";
import { StatusDot } from "@/components/ui/status-dot";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface WidgetContentProps {
  id: string;
}

export function WidgetContent({ id }: WidgetContentProps) {
  const { tasks: TASKS } = useTasks();
  const { workers: WORKERS } = useWorkers();
  const { projects: PROJECTS } = useProjects();

  if (id === "total-tasks") {
    const stats = [
      { l: "Running", v: TASKS.filter((t) => t.s === "running").length, c: "#c9a96e" },
      { l: "Blocked", v: TASKS.filter((t) => t.s === "awaiting_input").length, c: "#c9a96e" },
      { l: "Review", v: TASKS.filter((t) => t.s === "review").length, c: "#c9a96e" },
      { l: "Completed", v: TASKS.filter((t) => t.s === "completed").length, c: "#ededef" },
      { l: "Pending", v: TASKS.filter((t) => t.s === "pending").length, c: "#ededef" },
      { l: "Draft", v: TASKS.filter((t) => t.s === "draft").length, c: "#a1a1aa" },
    ];
    return (
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.l} className="p-2 rounded bg-bg-deep">
            <span className="text-[10px] block text-text-muted">{s.l}</span>
            <span className="text-xl font-bold" style={{ color: s.c }}>{s.v}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === "worker-hours") {
    if (WORKERS.length === 0) {
      return <EmptyWidget text="No workers configured yet." />;
    }
    return (
      <div className="space-y-2">
        {WORKERS.map((w) => {
          const total = w.done + w.active;
          const pct = total > 0 ? Math.round((w.done / total) * 100) : 0;
          return (
            <div key={w.id} className="flex items-center gap-2">
              <Avatar type={w.type} size={20} role={w.role} />
              <span className="text-xs w-24 truncate text-text-primary">{w.name}</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden bg-bg-deep">
                <div
                  className="h-full rounded-full bg-bg-elevated"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs w-10 text-right text-text-secondary">{total} tasks</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === "token-usage") {
    return <EmptyWidget text="Token tracking starts when AI workers process tasks." />;
  }

  if (id === "cost-tracker") {
    return (
      <div>
        <div className="text-3xl font-bold mb-1 text-text-primary">$0.00</div>
        <span className="text-xs text-text-muted">Today&apos;s spend &bull; No budget set</span>
        <div className="h-2 rounded-full mt-2 overflow-hidden bg-bg-deep">
          <div className="h-full rounded-full bg-accent" style={{ width: "0%" }} />
        </div>
      </div>
    );
  }

  if (id === "project-health") {
    if (PROJECTS.length === 0) {
      return <EmptyWidget text="No projects yet." />;
    }
    return (
      <div className="space-y-2">
        {PROJECTS.map((p) => {
          const pct = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0;
          return (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: p.color }} />
              <span className="text-xs w-36 truncate text-text-primary">{p.name}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-bg-deep">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: p.color }}
                />
              </div>
              <span className="text-xs w-10 text-right text-text-secondary">{pct}%</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === "worker-activity") {
    const activeWorkers = WORKERS.filter((w) => w.active > 0);
    if (activeWorkers.length === 0) {
      return <EmptyWidget text="No workers currently active." />;
    }
    return (
      <div className="space-y-2">
        {activeWorkers.map((w) => (
          <div key={w.id} className="flex items-center gap-2 p-2 rounded bg-bg-deep">
            <Avatar type={w.type} size={24} role={w.role} />
            <div className="flex-1 min-w-0">
              <span className="text-sm block truncate text-text-primary">{w.name}</span>
              <span className="text-[10px] text-text-muted">
                {w.active} task{w.active > 1 ? "s" : ""} active
              </span>
            </div>
            <StatusDot status={w.status} />
          </div>
        ))}
      </div>
    );
  }

  if (id === "needs-attention") {
    const attention = TASKS.filter((t) => t.s === "awaiting_input" || t.s === "review");
    if (attention.length === 0) {
      return <EmptyWidget text="All clear — no tasks need attention." />;
    }
    return (
      <div className="space-y-2">
        {attention.map((t) => {
          const sc = ST[t.s];
          return (
            <div key={t.id} className="p-2 rounded flex items-center gap-2 bg-bg-deep">
              <AlertTriangle size={14} style={{ color: sc.c }} />
              <span className="text-xs flex-1 truncate text-text-primary">{t.title}</span>
              <Badge color={sc.c} bg={sc.bg} small>{sc.l}</Badge>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === "recent-activity") {
    return <EmptyWidget text="Activity log will appear as workers process tasks." />;
  }

  if (id === "quick-task") {
    return <QuickTaskWidget />;
  }

  if (id === "quick-note") {
    return <QuickNoteWidget />;
  }

  if (id === "chat-preview") {
    return <ChatPreviewWidget />;
  }

  if (id === "custom-code") {
    return (
      <div>
        <textarea
          className="w-full px-3 py-2 rounded-lg text-xs font-mono border outline-none resize-none bg-bg-deep border-border-default text-text-primary"
          rows={3}
          defaultValue={`// Access data via orchestria.tasks, orchestria.workers\nconst blocked = orchestria.tasks.filter(t => t.status === 'blocked');\nreturn { value: blocked.length, label: 'Blocked' };`}
        />
        <span className="text-[10px] mt-1 block text-text-muted">Runs in sandboxed Web Worker</span>
      </div>
    );
  }

  if (id === "success-rate") {
    const withDone = WORKERS.filter((w) => w.done > 0);
    if (withDone.length === 0) {
      return <EmptyWidget text="No completed tasks yet." />;
    }
    return (
      <div className="space-y-2">
        {withDone.map((w) => {
          const rate = Math.round((w.done / (w.done + w.active)) * 100);
          return (
            <div key={w.id} className="flex items-center gap-2">
              <Avatar type={w.type} size={20} role={w.role} />
              <span className="text-xs w-24 truncate text-text-primary">{w.name}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-bg-deep">
                <div className="h-full rounded-full bg-accent" style={{ width: `${rate}%` }} />
              </div>
              <span className="text-xs w-10 text-right text-text-secondary">{rate}%</span>
            </div>
          );
        })}
      </div>
    );
  }

  return <span className="text-xs text-text-muted">Widget content</span>;
}

function EmptyWidget({ text }: { text: string }) {
  return (
    <div className="py-4 text-center">
      <p className="text-xs text-text-muted">{text}</p>
    </div>
  );
}

function ChatPreviewWidget() {
  const { messages } = useChats();
  const last = messages[messages.length - 1];
  if (!last) {
    return <EmptyWidget text="No chat messages yet." />;
  }
  return (
    <div className="p-2 rounded bg-bg-deep">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] text-text-muted">{last.time}</span>
      </div>
      <p className="text-xs line-clamp-3 text-text-secondary">
        {last.content}
      </p>
    </div>
  );
}

function QuickTaskWidget() {
  const { createTask } = useTasks();
  const { projects } = useProjects();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  async function handleAdd() {
    if (!title.trim()) return;
    await createTask({
      title: title.trim(),
      s: "pending",
      p: priority as import("@/lib/types").Priority,
      pr: projects[0]?.id || "",
      w: null,
      tags: [],
      lock: false,
      sub: 0,
      subD: 0,
    });
    setTitle("");
    setPriority("medium");
  }

  return (
    <div className="space-y-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
        placeholder="Task title..."
      />
      <div className="flex gap-2">
        <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="medium">Medium</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="low">Low</option>
        </Select>
        <Button primary onClick={handleAdd}><Plus size={14} /> Add</Button>
      </div>
    </div>
  );
}

function QuickNoteWidget() {
  const { createNote } = useNotes();
  const { projects } = useProjects();
  const [text, setText] = useState("");

  async function handleSave() {
    if (!text.trim()) return;
    await createNote(text.trim(), projects[0]?.id || "");
    setText("");
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none glass-input text-text-primary placeholder:text-text-muted"
        rows={2}
        placeholder="Jot something down..."
      />
      <Button primary className="mt-2" onClick={handleSave}><Edit3 size={14} /> Save Note</Button>
    </div>
  );
}
