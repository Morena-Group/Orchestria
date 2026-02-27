/**
 * DB row ↔ TypeScript interface mappers.
 * DB uses snake_case; TS interfaces use abbreviated/camelCase names.
 */

import type {
  Project, Worker, Task, ChatMessage, Notification,
  Plugin, PluginData, PluginDataMetric, PluginDataRow,
  PlanNode, Plan, PlanChat, Note,
  StorageFile, KnowledgeIndexEntry, MemoryFact, CompactionLogEntry,
  TaskStatus, Priority, WorkerType, WorkerStatus, WorkerRole,
  ActivityType, KnowledgeType,
} from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatRelative(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = Date.now();
  const diff = now - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

// ─── Project ──────────────────────────────────────────────

export function mapProject(row: Row): Project {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    total: row.total,
    done: row.done,
  };
}

export function unmapProject(p: Partial<Project>): Row {
  const row: Row = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.color !== undefined) row.color = p.color;
  if (p.total !== undefined) row.total = p.total;
  if (p.done !== undefined) row.done = p.done;
  return row;
}

// ─── Worker ───────────────────────────────────────────────

export function mapWorker(row: Row): Worker {
  return {
    id: row.id,
    name: row.name,
    type: row.type as WorkerType,
    role: row.role as WorkerRole,
    status: row.status as WorkerStatus,
    active: row.active,
    done: row.done,
    model: row.model ?? null,
    think: row.think ?? null,
    isHuman: row.is_human,
    skills: row.skills ?? [],
    email: row.email ?? undefined,
    contact: row.contact ?? undefined,
  };
}

export function unmapWorker(w: Partial<Worker>): Row {
  const row: Row = {};
  if (w.name !== undefined) row.name = w.name;
  if (w.type !== undefined) row.type = w.type;
  if (w.role !== undefined) row.role = w.role;
  if (w.status !== undefined) row.status = w.status;
  if (w.active !== undefined) row.active = w.active;
  if (w.done !== undefined) row.done = w.done;
  if (w.model !== undefined) row.model = w.model;
  if (w.think !== undefined) row.think = w.think;
  if (w.isHuman !== undefined) row.is_human = w.isHuman;
  if (w.skills !== undefined) row.skills = w.skills;
  if (w.email !== undefined) row.email = w.email;
  if (w.contact !== undefined) row.contact = w.contact;
  return row;
}

// ─── Task ─────────────────────────────────────────────────

export function mapTask(row: Row): Task {
  return {
    id: row.id,
    title: row.title,
    s: row.status as TaskStatus,
    p: row.priority as Priority,
    w: row.worker_id ?? null,
    pr: row.project_id,
    sub: row.sub,
    subD: row.sub_done,
    lock: row.lock,
    tags: row.tags ?? [],
    block: row.block ?? undefined,
  };
}

export function unmapTask(t: Partial<Task>): Row {
  const row: Row = {};
  if (t.title !== undefined) row.title = t.title;
  if (t.s !== undefined) row.status = t.s;
  if (t.p !== undefined) row.priority = t.p;
  if (t.w !== undefined) row.worker_id = t.w;
  if (t.pr !== undefined) row.project_id = t.pr;
  if (t.sub !== undefined) row.sub = t.sub;
  if (t.subD !== undefined) row.sub_done = t.subD;
  if (t.lock !== undefined) row.lock = t.lock;
  if (t.tags !== undefined) row.tags = t.tags;
  if (t.block !== undefined) row.block = t.block || null;
  return row;
}

// ─── Note ─────────────────────────────────────────────────

export function mapNote(row: Row, projectName?: string): Note {
  return {
    id: row.id,
    title: row.title,
    proj: projectName ?? row.project_id ?? "",
    content: row.content,
    proposed: row.proposed,
    pinned: row.pinned,
    updated: formatRelative(row.updated_at),
  };
}

export function unmapNote(n: Partial<Note>, projectId?: string): Row {
  const row: Row = {};
  if (n.title !== undefined) row.title = n.title;
  if (projectId !== undefined) row.project_id = projectId;
  if (n.content !== undefined) row.content = n.content;
  if (n.proposed !== undefined) row.proposed = n.proposed;
  if (n.pinned !== undefined) row.pinned = n.pinned;
  return row;
}

// ─── Notification ─────────────────────────────────────────

export function mapNotification(row: Row): Notification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    desc: row.description,
    time: row.time,
    read: row.read,
    icon: row.icon,
    color: row.color,
  };
}

// ─── Chat ─────────────────────────────────────────────────

export function mapChat(row: Row): ChatMessage {
  return {
    id: row.id,
    role: row.role as "user" | "bot",
    content: row.content,
    time: formatTime(row.created_at),
  };
}

// ─── Plugin ───────────────────────────────────────────────

export function mapPlugin(configRow: Row, dataRows: Row[]): Plugin {
  const data: PluginData[] = dataRows.map((d) => {
    if (d.type === "metric") {
      const m: PluginDataMetric = {
        id: d.id,
        type: "metric",
        label: d.label,
        value: d.data?.value ?? "",
        change: d.data?.change ?? "",
        changeUp: d.data?.changeUp ?? true,
      };
      return m;
    }
    const r: PluginDataRow = {
      id: d.id,
      type: "row",
      label: d.label,
      rows: d.data?.rows ?? [],
    };
    return r;
  });

  return {
    id: configRow.id,
    name: configRow.name,
    icon: configRow.icon,
    cat: configRow.cat,
    status: configRow.status,
    auth: configRow.auth,
    lastSync: configRow.last_sync ?? "",
    items: configRow.items,
    desc: configRow.description,
    color: configRow.color,
    data,
  };
}

// ─── Plan ─────────────────────────────────────────────────

export function mapPlan(row: Row): Plan {
  return {
    id: row.id,
    name: row.name,
    created: new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

// ─── PlanNode ─────────────────────────────────────────────

export function mapPlanNode(row: Row): PlanNode {
  return {
    id: row.id,
    level: row.level,
    label: row.label,
    status: row.status as TaskStatus,
    priority: row.priority as Priority,
    worker: row.worker_id ?? null,
    act: (row.activity as ActivityType) ?? null,
    review: row.review,
    tags: row.tags ?? [],
    children: row.children ?? [],
    description: row.description,
  };
}

export function unmapPlanNode(n: Partial<PlanNode>): Row {
  const row: Row = {};
  if (n.level !== undefined) row.level = n.level;
  if (n.label !== undefined) row.label = n.label;
  if (n.status !== undefined) row.status = n.status;
  if (n.priority !== undefined) row.priority = n.priority;
  if (n.worker !== undefined) row.worker_id = n.worker;
  if (n.act !== undefined) row.activity = n.act;
  if (n.review !== undefined) row.review = n.review;
  if (n.tags !== undefined) row.tags = n.tags;
  if (n.children !== undefined) row.children = n.children;
  if (n.description !== undefined) row.description = n.description;
  return row;
}

// ─── PlanChat ─────────────────────────────────────────────

export function mapPlanChat(row: Row): PlanChat {
  return {
    role: row.role as "user" | "bot",
    content: row.content,
    time: formatTime(row.created_at),
  };
}

// ─── StorageFile ──────────────────────────────────────────

export function mapStorageFile(row: Row): StorageFile {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    proj: row.project_id,
    projName: row.project_name ?? "",
    worker: row.worker_name ?? null,
    workerType: (row.worker_type as WorkerType) ?? null,
    task: row.task_name ?? null,
    size: row.size,
    date: row.date,
    recency: row.recency,
    status: row.status,
    tags: row.tags ?? [],
    isUpload: row.is_upload ?? false,
    isShared: row.is_shared ?? false,
  };
}

// ─── KnowledgeIndexEntry ──────────────────────────────────

export function mapKnowledgeEntry(row: Row, projectName?: string): KnowledgeIndexEntry {
  return {
    id: row.id,
    type: row.type as KnowledgeType,
    label: row.label,
    proj: projectName ?? row.project_id ?? "",
    summary: row.summary,
    tags: row.tags ?? [],
    updated: formatRelative(row.updated_at),
    tokens: row.tokens,
  };
}

// ─── MemoryFact ───────────────────────────────────────────

export function mapMemoryFact(row: Row, projectName?: string): MemoryFact {
  return {
    id: row.id,
    content: row.content,
    source: row.source,
    proj: projectName ?? row.project_id ?? "",
    date: formatRelative(row.created_at),
    tags: row.tags ?? [],
  };
}

// ─── CompactionLogEntry ───────────────────────────────────

export function mapCompactionEntry(row: Row): CompactionLogEntry {
  return {
    id: row.id,
    task: row.task_name,
    run: row.run,
    factsExtracted: row.facts_extracted,
    stepsDeleted: row.steps_deleted,
    date: formatRelative(row.created_at),
    status: row.status,
    note: row.note ?? undefined,
  };
}
