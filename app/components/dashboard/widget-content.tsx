"use client";

import { useState } from "react";
import {
  CheckCircle2, Plus, Edit3, AlertTriangle,
} from "lucide-react";
import { ST } from "@/lib/constants/status";
import { useTasks, useWorkers, useProjects } from "@/lib/hooks";
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
    const hrs = [
      { pct: 72, h: "4.3" },
      { pct: 35, h: "2.1" },
      { pct: 12, h: "0.7" },
      { pct: 58, h: "3.5" },
      { pct: 28, h: "1.7" },
    ];
    return (
      <div className="space-y-2">
        {WORKERS.map((w, i) => {
          const d = hrs[i] || { pct: 40, h: "2.4" };
          return (
            <div key={w.id} className="flex items-center gap-2">
              <Avatar type={w.type} size={20} role={w.role} />
              <span className="text-xs w-24 truncate text-text-primary">{w.name}</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden bg-bg-deep">
                <div
                  className="h-full rounded-full bg-bg-elevated"
                  style={{ width: `${d.pct}%` }}
                />
              </div>
              <span className="text-xs w-10 text-right text-text-secondary">{d.h}h</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (id === "token-usage") {
    const usage = [
      { n: "Claude", v: "1.2M", c: "$18.00" },
      { n: "Gemini", v: "800K", c: "$4.00" },
      { n: "GPT-4o", v: "200K", c: "$2.00" },
    ];
    return (
      <div className="space-y-2">
        {usage.map((u) => (
          <div key={u.n} className="flex items-center justify-between p-2 rounded bg-bg-deep">
            <span className="text-xs text-text-secondary">{u.n}</span>
            <span className="text-xs font-medium text-text-primary">{u.v} tokens</span>
            <span className="text-xs font-bold text-text-primary">{u.c}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-border-default">
          <span className="text-xs text-text-secondary">Total today</span>
          <span className="text-sm font-bold text-text-primary">$24.00</span>
        </div>
      </div>
    );
  }

  if (id === "cost-tracker") {
    return (
      <div>
        <div className="text-3xl font-bold mb-1 text-text-primary">$24.00</div>
        <span className="text-xs text-text-muted">Today&apos;s spend &bull; Budget: $50/day</span>
        <div className="h-2 rounded-full mt-2 overflow-hidden bg-bg-deep">
          <div className="h-full rounded-full bg-accent" style={{ width: "48%" }} />
        </div>
      </div>
    );
  }

  if (id === "project-health") {
    return (
      <div className="space-y-2">
        {PROJECTS.map((p) => {
          const pct = Math.round((p.done / p.total) * 100);
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
    return (
      <div className="space-y-2">
        {WORKERS.filter((w) => w.active > 0).map((w) => (
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
    return (
      <div className="space-y-2">
        {TASKS.filter((t) => t.s === "awaiting_input" || t.s === "review").map((t) => {
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
    const events = [
      { t: "2m", e: "Claude completed 'DB schema'", c: "#c9a96e" },
      { t: "15m", e: "Kimi started 'Security audit'", c: "#c9a96e" },
      { t: "1h", e: "ChatGPT blocked on 'API docs'", c: "#c9a96e" },
      { t: "2h", e: "Gemini completed 'Market research'", c: "#c9a96e" },
    ];
    return (
      <div className="space-y-1">
        {events.map((a, i) => (
          <div key={i} className="flex items-center gap-2 p-1">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: a.c }} />
            <span className="text-xs flex-1 text-text-primary">{a.e}</span>
            <span className="text-[10px] text-text-muted">{a.t}</span>
          </div>
        ))}
      </div>
    );
  }

  if (id === "quick-task") {
    return <QuickTaskWidget />;
  }

  if (id === "quick-note") {
    return <QuickNoteWidget />;
  }

  if (id === "chat-preview") {
    return (
      <div className="p-2 rounded bg-bg-deep">
        <div className="flex items-center gap-2 mb-1">
          <Avatar type="claude-cli" size={18} role="orchestrator" />
          <span className="text-[10px] text-text-muted">10:25 AM</span>
        </div>
        <p className="text-xs line-clamp-3 text-text-secondary">
          Done! Created 6 subtasks under &apos;Auth Module&apos;. All in Draft.
        </p>
      </div>
    );
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

  // Fallback for widgets without specific content yet
  if (id === "success-rate") {
    return (
      <div className="space-y-2">
        {WORKERS.filter((w) => w.done > 0).map((w) => {
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

function QuickTaskWidget() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  function handleAdd() {
    if (!title.trim()) return;
    console.log("Quick task added:", { title: title.trim(), priority });
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
  const [text, setText] = useState("");

  function handleSave() {
    if (!text.trim()) return;
    console.log("Quick note saved:", text.trim());
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
