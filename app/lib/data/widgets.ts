import type { WidgetDefinition } from "@/lib/types";

export const WIDGET_CATALOG: WidgetDefinition[] = [
  { id: "total-tasks", cat: "Stats", name: "Total Tasks", desc: "Task counts by status", icon: "ListTodo", default: true },
  { id: "worker-hours", cat: "Stats", name: "Worker Hours Today", desc: "Time spent per worker today", icon: "Timer", default: false },
  { id: "token-usage", cat: "Stats", name: "Token Usage", desc: "Tokens consumed today/week/month", icon: "Cpu", default: false },
  { id: "cost-tracker", cat: "Stats", name: "Cost Tracker", desc: "API costs breakdown", icon: "DollarSign", default: false },
  { id: "success-rate", cat: "Stats", name: "Success Rate", desc: "% tasks completed per worker", icon: "TrendingUp", default: false },
  { id: "task-trend", cat: "Stats", name: "Completion Trend", desc: "Tasks completed over 7/30 days", icon: "BarChart3", default: false },
  { id: "project-health", cat: "Overview", name: "Project Health", desc: "Progress bars per project", icon: "Activity", default: true },
  { id: "worker-activity", cat: "Overview", name: "Worker Activity", desc: "Who is doing what right now", icon: "Bot", default: true },
  { id: "needs-attention", cat: "Overview", name: "Needs Attention", desc: "Blocked and review tasks", icon: "AlertTriangle", default: true },
  { id: "recent-activity", cat: "Overview", name: "Recent Activity", desc: "Timeline of events", icon: "Clock", default: true },
  { id: "scheduled", cat: "Overview", name: "Upcoming Scheduled", desc: "Tasks scheduled for today/week", icon: "Calendar", default: false },
  { id: "master-progress", cat: "Overview", name: "Master Plan Progress", desc: "Active master plan status", icon: "Workflow", default: false },
  { id: "quick-task", cat: "Actions", name: "Quick Task", desc: "Create task inline", icon: "Plus", default: false },
  { id: "quick-note", cat: "Actions", name: "Quick Note", desc: "Jot down a note fast", icon: "Edit3", default: false },
  { id: "chat-preview", cat: "Actions", name: "Chat Preview", desc: "Last orchestrator message", icon: "MessageSquare", default: false },
  { id: "briefing-summary", cat: "Actions", name: "Briefing Summary", desc: "Latest briefing excerpt", icon: "Sparkles", default: false },
  { id: "custom-code", cat: "Custom", name: "Custom Metric", desc: "Write JS to compute custom metrics", icon: "Code", default: false },
];
