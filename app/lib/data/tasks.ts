import type { Task } from "@/lib/types";

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

export const TASKS: Task[] = [
  { id: "t1", title: "Design database schema for user auth", s: "completed", p: "high", w: "w1", pr: "p1", sub: 3, subD: 3, lock: false, tags: ["backend", "db"] },
  { id: "t2", title: "Research competitor pricing models", s: "running", p: "medium", w: "w2", pr: "p1", sub: 5, subD: 2, lock: false, tags: ["research"] },
  { id: "t3", title: "Write API documentation", s: "awaiting_input", p: "medium", w: "w3", pr: "p1", sub: 0, subD: 0, lock: false, tags: ["docs"], block: "Need API key for testing endpoint authentication" },
  { id: "t4", title: "Implement Kanban drag-and-drop", s: "review", p: "high", w: "w1", pr: "p1", sub: 4, subD: 4, lock: false, tags: ["frontend"] },
  { id: "t5", title: "Set up CI/CD pipeline", s: "pending", p: "urgent", w: "w4", pr: "p1", sub: 6, subD: 0, lock: false, tags: ["devops"] },
  { id: "t6", title: "Create landing page copy", s: "draft", p: "low", w: null, pr: "p1", sub: 0, subD: 0, lock: false, tags: ["marketing"] },
  { id: "t7", title: "Optimize database queries", s: "approved", p: "high", w: "w1", pr: "p1", sub: 3, subD: 0, lock: true, tags: ["backend", "perf"] },
  { id: "t8", title: "Security audit - auth flow", s: "running", p: "urgent", w: "w4", pr: "p1", sub: 8, subD: 3, lock: false, tags: ["security"] },
  { id: "t9", title: "Approve infrastructure budget", s: "awaiting_input", p: "high", w: "w5", pr: "p1", sub: 0, subD: 0, lock: false, tags: ["ops"], block: "Waiting for Michael to approve AWS spend increase" },
  { id: "t10", title: "User onboarding flow design", s: "throttled", p: "medium", w: "w2", pr: "p1", sub: 2, subD: 1, lock: false, tags: ["ux"] },
];

export const TASK_SUBTASKS: Record<string, string[]> = {
  t1: ["Create users table with UUID PKs", "Add sessions table with JWT storage", "Define roles & permissions tables"],
  t2: ["Analyze Linear pricing & features", "Analyze Notion pricing & features", "Analyze Monday pricing & features", "Compare feature matrices", "Write final pricing recommendation"],
  t4: ["Set up React DnD provider", "Implement column drag handles", "Add card drag between columns", "Optimistic UI updates on drop"],
  t5: ["Configure GitHub Actions workflow", "Set up Docker build pipeline", "Add Supabase migration step", "Configure Vercel deployment", "Add staging environment", "Add production environment"],
  t8: ["Test SQL injection vectors", "Check XSS in input fields", "Verify CSRF token implementation", "Test session hijacking scenarios", "Audit rate limiting logic", "Check password hashing strength", "Review OAuth token storage", "Test 2FA bypass attempts"],
  t10: ["Design onboarding wizard layout", "Implement step progress indicator"],
};

export const TASK_DESCRIPTIONS: Record<string, string> = {
  t1: "Design the complete database schema for user authentication including users, sessions, roles, and permissions tables. Must support OAuth providers and 2FA tokens.",
  t2: "Research 5 competitor pricing models (Linear, Notion, Monday, ClickUp, Asana). Document tiers, limits, and unique selling points.",
  t3: "Write comprehensive API documentation covering all endpoints, authentication, rate limits, and error codes. Include code examples in JS and Python.",
  t4: "Implement drag-and-drop Kanban board using React DnD. Support column reordering, task moving between columns, and optimistic updates.",
  t5: "Set up GitHub Actions CI/CD pipeline with staging and production environments. Include Docker builds, Supabase migrations, and Vercel deploys.",
  t8: "Conduct security audit of the authentication flow. Check for SQL injection, XSS, CSRF, session hijacking, and rate limit bypass.",
  t9: "Review and approve the proposed AWS infrastructure spend increase from $200/mo to $500/mo for production scaling.",
};

export const TASK_TIMELINE: TaskTimelineEvent[] = [
  { time: "Today 10:30", actor: "Claude Opus", type: "step", text: "Started analyzing existing auth tables" },
  { time: "Today 10:31", actor: "Claude Opus", type: "step", text: "Queried Supabase schema for current user table structure" },
  { time: "Today 10:32", actor: "Claude Opus", type: "tool", text: "Tool call: supabase.query('SELECT * FROM information_schema.tables')" },
  { time: "Today 10:33", actor: "Claude Opus", type: "decision", text: "Decision: Use UUID for user IDs instead of serial integers for better security" },
  { time: "Today 10:35", actor: "Claude Opus", type: "step", text: "Designed sessions table with JWT token storage and expiry" },
  { time: "Today 10:38", actor: "Claude Opus", type: "output", text: "Generated schema.sql with 4 tables: users, sessions, roles, user_roles" },
  { time: "Today 10:39", actor: "System", type: "status", text: "Task moved to Review" },
  { time: "Today 10:42", actor: "Michael", type: "comment", text: "Looks good, but add a refresh_token column to sessions" },
];

export const TASK_ARTIFACTS: TaskArtifact[] = [
  { name: "schema.sql", size: "4.2 KB", type: "code", date: "Today 10:38" },
  { name: "er-diagram.png", size: "128 KB", type: "image", date: "Today 10:37" },
  { name: "migration-001.sql", size: "1.8 KB", type: "code", date: "Today 10:39" },
];

export const TASK_COMMENTS: TaskComment[] = [
  { id: "c1", author: "Michael", isHuman: true, time: "Today 10:42", text: "Looks good, but add a refresh_token column to sessions table." },
  { id: "c2", author: "Claude Opus", isHuman: false, type: "claude-cli", time: "Today 10:43", text: "Good catch. I'll add refresh_token (TEXT) and refresh_token_expires_at (TIMESTAMPTZ) to the sessions table. Updating schema now." },
];
