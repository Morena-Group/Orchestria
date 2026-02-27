import type { TaskStatus, Priority, WorkerType, ActivityType } from "@/lib/types";

// Status configuration — maps task status to display properties
export const ST: Record<TaskStatus, { l: string; c: string; bg: string; icon: string }> = {
  draft:          { l: "Draft",          c: "#a1a1aa", bg: "#1c1f2e",                 icon: "Edit3" },
  pending:        { l: "Pending",        c: "#a1a1aa", bg: "#1c1f2e",                 icon: "Clock" },
  approved:       { l: "Approved",       c: "#a1a1aa", bg: "#1c1f2e",                 icon: "Check" },
  running:        { l: "Running",        c: "#c9a96e", bg: "rgba(201,169,110,0.15)",  icon: "Play" },
  awaiting_input: { l: "Awaiting Input", c: "#c9a96e", bg: "rgba(201,169,110,0.15)",  icon: "AlertTriangle" },
  review:         { l: "Review",         c: "#c9a96e", bg: "rgba(201,169,110,0.15)",  icon: "Eye" },
  completed:      { l: "Completed",      c: "#a1a1aa", bg: "#1c1f2e",                 icon: "CheckCircle2" },
  failed:         { l: "Failed",         c: "#f87171", bg: "#2a1215",                 icon: "XCircle" },
  throttled:      { l: "Throttled",      c: "#c9a96e", bg: "rgba(201,169,110,0.15)",  icon: "Pause" },
};

// Priority configuration
export const PRI: Record<Priority, { l: string; c: string }> = {
  urgent: { l: "Urgent", c: "#ededef" },
  high:   { l: "High",   c: "#ededef" },
  medium: { l: "Medium", c: "#a1a1aa" },
  low:    { l: "Low",    c: "#71717a" },
};

// Worker type configuration
export const WT: Record<WorkerType, { n: string; c: string; a: string }> = {
  "claude-cli":  { n: "Claude",  c: "#1c1f2e", a: "C" },
  "gemini-cli":  { n: "Gemini",  c: "#1c1f2e", a: "G" },
  "chatgpt-cli": { n: "ChatGPT", c: "#1c1f2e", a: "O" },
  "kimi-cli":    { n: "Kimi",    c: "#1c1f2e", a: "K" },
  "human":       { n: "Human",   c: "#1c1f2e", a: "H" },
};

// Activity type configuration (for planner)
export const ACT: Record<ActivityType, { l: string; c: string; bg: string; icon: string; desc: string }> = {
  gather:     { l: "Gather",     c: "#c9a96e", bg: "#3d3222", icon: "Search",    desc: "Research, collect info" },
  build:      { l: "Build",      c: "#c9a96e", bg: "#3d3222", icon: "Zap",       desc: "Implement, create, code" },
  assess:     { l: "Assess",     c: "#c9a96e", bg: "#3d3222", icon: "Eye",       desc: "Evaluate, review, QA" },
  synthesize: { l: "Synthesize", c: "#c9a96e", bg: "#3d3222", icon: "Layers",    desc: "Aggregate, report, summarize" },
  fix:        { l: "Fix",        c: "#f87171", bg: "#2a1215", icon: "RefreshCw", desc: "Correct, debug, follow-up" },
};

// Kanban column order
export const KANBAN_COLUMNS: TaskStatus[] = [
  "draft",
  "pending",
  "approved",
  "running",
  "awaiting_input",
  "review",
  "completed",
];

// Icon map — resolves string icon names to lucide-react components
// Import and use: StatusIcon = ICON_MAP[ST[status].icon]
export { getStatusIcon } from "./icons";
