// Task statuses
export type TaskStatus =
  | "draft"
  | "pending"
  | "approved"
  | "running"
  | "awaiting_input"
  | "review"
  | "completed"
  | "failed"
  | "throttled";

// Priority levels
export type Priority = "urgent" | "high" | "medium" | "low";

// Worker types
export type WorkerType =
  | "claude-cli"
  | "gemini-cli"
  | "chatgpt-cli"
  | "kimi-cli"
  | "human";

// Worker status
export type WorkerStatus = "online" | "offline" | "busy";

// Worker role
export type WorkerRole = "worker" | "orchestrator" | "both";

// Activity types (planner)
export type ActivityType = "gather" | "build" | "assess" | "synthesize" | "fix";

// Knowledge index entry types
export type KnowledgeType =
  | "artifact"
  | "memory_fact"
  | "plugin_data"
  | "file"
  | "task_output";

// Context mode
export type ContextMode = "full" | "recency" | "custom";

// --- Data interfaces ---

export interface Project {
  id: string;
  name: string;
  color: string;
  total: number;
  done: number;
}

export interface Worker {
  id: string;
  name: string;
  type: WorkerType;
  role: WorkerRole;
  status: WorkerStatus;
  active: number;
  done: number;
  model: string | null;
  think: string | null;
  isHuman: boolean;
  skills?: string[];
  email?: string;
  contact?: string;
}

export interface Task {
  id: string;
  title: string;
  s: TaskStatus;
  p: Priority;
  w: string | null;
  pr: string;
  sub: number;
  subD: number;
  lock: boolean;
  tags: string[];
  block?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: string;
  color: string;
}

export interface PluginDataMetric {
  id: string;
  type: "metric";
  label: string;
  value: string;
  change: string;
  changeUp: boolean;
}

export interface PluginDataRow {
  id: string;
  type: "row";
  label: string;
  rows: {
    name: string;
    amount: string;
    date: string;
    status: string;
  }[];
}

export type PluginData = PluginDataMetric | PluginDataRow;

export interface Plugin {
  id: string;
  name: string;
  icon: string;
  cat: string;
  status: string;
  auth: string;
  lastSync: string;
  items: number;
  desc: string;
  color: string;
  data: PluginData[];
}

export interface MarketplacePlugin {
  id: string;
  name: string;
  icon: string;
  cat: string;
  desc: string;
  color: string;
  installed: boolean;
}

export interface WidgetDefinition {
  id: string;
  cat: string;
  name: string;
  desc: string;
  icon: string;
  default: boolean;
}

export interface HumanSkill {
  id: string;
  l: string;
  d: string;
}

export interface PlanTemplate {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export interface Plan {
  id: string;
  name: string;
  created: string;
}

export interface PlanNode {
  id: string;
  level: number;
  label: string;
  status: TaskStatus;
  priority: Priority;
  worker: string | null;
  act: ActivityType | null;
  review: string;
  tags: string[];
  children: string[];
  description: string;
}

export interface PlanChat {
  role: "user" | "bot";
  content: string;
  time: string;
}

export interface Note {
  id: string;
  title: string;
  proj: string;
  content: string;
  proposed: number;
  pinned: boolean;
  updated: string;
}

export interface ReportBlock {
  id: string;
  name: string;
  desc: string;
  icon: string;
  default: boolean;
}

export interface StorageFile {
  id: string;
  name: string;
  type: string;
  proj: string | null;
  projName: string;
  worker: string | null;
  workerType: WorkerType | null;
  task: string | null;
  size: string;
  date: string;
  recency: number;
  status: string;
  tags: string[];
  isUpload?: boolean;
  isShared?: boolean;
}

export interface KnowledgeIndexEntry {
  id: string;
  type: KnowledgeType;
  label: string;
  proj: string;
  summary: string;
  tags: string[];
  updated: string;
  tokens: number;
}

export interface MemoryFact {
  id: string;
  content: string;
  source: string;
  proj: string;
  date: string;
  tags: string[];
}

export interface CompactionLogEntry {
  id: string;
  task: string;
  run: string;
  factsExtracted: number;
  stepsDeleted: number;
  date: string;
  status: string;
  note?: string;
}

// Status config used for rendering
export interface StatusConfig {
  l: string;
  c: string;
  bg: string;
  icon: string;
}

// Priority config
export interface PriorityConfig {
  l: string;
  c: string;
}

// Worker type config
export interface WorkerTypeConfig {
  n: string;
  c: string;
  a: string;
}

// Activity config
export interface ActivityConfig {
  l: string;
  c: string;
  bg: string;
  icon: string;
  desc: string;
}

// Task detail sub-types
export interface TaskTimelineEvent {
  time: string;
  actor: string;
  type: string;
  text: string;
}

export interface TaskArtifact {
  name: string;
  size: string;
  type: string;
  date: string;
}

export interface TaskComment {
  id: string;
  author: string;
  isHuman: boolean;
  type?: string;
  time: string;
  text: string;
}

// Nav item
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}
