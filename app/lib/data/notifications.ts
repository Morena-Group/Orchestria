import type { Notification } from "@/lib/types";

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "completed", title: "Task completed", desc: "'Design database schema' finished by Claude Opus", time: "2m ago", read: false, icon: "CheckCircle2", color: "#a1a1aa" },
  { id: "n2", type: "blocked", title: "Agent blocked", desc: "ChatGPT Writer needs API key for 'Write API documentation'", time: "15m ago", read: false, icon: "AlertTriangle", color: "#f87171" },
  { id: "n3", type: "review", title: "Ready for review", desc: "'Implement Kanban drag-and-drop' awaiting your approval", time: "1h ago", read: false, icon: "Eye", color: "#c9a96e" },
  { id: "n4", type: "completed", title: "Task completed", desc: "'Research competitor pricing' finished by Gemini Research", time: "2h ago", read: true, icon: "CheckCircle2", color: "#a1a1aa" },
  { id: "n5", type: "system", title: "Rate limit warning", desc: "Claude Opus approaching 80% of daily token budget", time: "3h ago", read: true, icon: "AlertTriangle", color: "#c9a96e" },
  { id: "n6", type: "plan", title: "Plan stage completed", desc: "'Research & Architecture' phase fully completed", time: "4h ago", read: true, icon: "Workflow", color: "#a1a1aa" },
];
