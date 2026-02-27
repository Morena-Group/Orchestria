import type { ReportBlock } from "@/lib/types";

export const REPORT_BLOCKS: ReportBlock[] = [
  { id: "exec-summary", name: "Executive Summary", desc: "AI-generated 3-5 sentence overview", icon: "Sparkles", default: true },
  { id: "task-stats", name: "Task Statistics", desc: "Counts by status, completion rate", icon: "BarChart3", default: true },
  { id: "per-project", name: "Per-Project Breakdown", desc: "Detailed stats per project", icon: "Activity", default: true },
  { id: "worker-perf", name: "Worker Performance", desc: "Hours, success rate, cost per worker", icon: "Bot", default: false },
  { id: "token-cost", name: "Token / Cost Report", desc: "API spending breakdown", icon: "DollarSign", default: false },
  { id: "completed-list", name: "Completed Tasks", desc: "List with details", icon: "CheckCircle2", default: false },
  { id: "blocked-analysis", name: "Blocked / Failed Analysis", desc: "Why tasks got stuck", icon: "AlertTriangle", default: false },
  { id: "recommendations", name: "Recommendations", desc: "AI-suggested next steps", icon: "Sparkles", default: true },
  { id: "timeline", name: "Timeline View", desc: "Visual progress timeline", icon: "Calendar", default: false },
  { id: "notes-summary", name: "Notes Summary", desc: "Condensed notes for period", icon: "FileText", default: false },
  { id: "custom-block", name: "Custom Block", desc: "JS-powered custom section", icon: "Code", default: false },
];
