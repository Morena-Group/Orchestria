import type { TaskStatus } from "@/lib/types";

export interface TaskAction {
  id: string;
  label: string;
  icon: string;
  targetStatus?: TaskStatus;
  variant: "default" | "primary" | "danger";
  requiresComment?: boolean;
}

export const TASK_ACTIONS: Record<string, TaskAction[]> = {
  draft: [
    { id: "move-pending", label: "Move to Pending", icon: "ArrowRight", targetStatus: "pending", variant: "primary" },
    { id: "edit", label: "Edit", icon: "Edit3", variant: "default" },
    { id: "delete", label: "Delete", icon: "Trash2", variant: "danger" },
  ],
  pending: [
    { id: "assign", label: "Assign Worker", icon: "UserPlus", variant: "primary" },
    { id: "edit", label: "Edit", icon: "Edit3", variant: "default" },
    { id: "delete", label: "Delete", icon: "Trash2", variant: "danger" },
  ],
  approved: [
    { id: "start", label: "Start", icon: "Play", targetStatus: "running", variant: "primary" },
    { id: "edit", label: "Edit", icon: "Edit3", variant: "default" },
  ],
  running: [
    { id: "pause", label: "Pause", icon: "Pause", targetStatus: "pending", variant: "default" },
  ],
  awaiting_input: [
    { id: "provide-input", label: "Provide Input", icon: "MessageSquare", variant: "primary", requiresComment: true },
    { id: "resume", label: "Resume", icon: "Play", targetStatus: "running", variant: "default" },
  ],
  review: [
    { id: "approve", label: "Approve", icon: "Check", targetStatus: "completed", variant: "primary" },
    { id: "reject", label: "Reject", icon: "XCircle", targetStatus: "failed", variant: "danger" },
    { id: "return-feedback", label: "Return with Feedback", icon: "MessageSquare", targetStatus: "approved", variant: "default", requiresComment: true },
  ],
  failed: [
    { id: "retry", label: "Retry with Comments", icon: "RefreshCw", targetStatus: "approved", variant: "primary", requiresComment: true },
  ],
  completed: [
    { id: "reopen", label: "Reopen", icon: "RefreshCw", targetStatus: "pending", variant: "default" },
  ],
  throttled: [
    { id: "resume", label: "Resume", icon: "Play", targetStatus: "approved", variant: "primary" },
  ],
};
