import type { StorageFile, KnowledgeIndexEntry, MemoryFact, CompactionLogEntry } from "@/lib/types";

export const STORAGE_FILES: StorageFile[] = [
  { id: "f1", name: "schema.sql", type: "code", proj: "p1", projName: "AI SaaS Platform", worker: "Claude Opus", workerType: "claude-cli", task: "Design database schema", size: "4.2 KB", date: "2h ago", recency: 3, status: "approved", tags: ["backend", "db"] },
  { id: "f2", name: "competitor-analysis.md", type: "doc", proj: "p1", projName: "AI SaaS Platform", worker: "Gemini Research", workerType: "gemini-cli", task: "Research competitor pricing", size: "45 KB", date: "4h ago", recency: 5, status: "review", tags: ["research"] },
  { id: "f3", name: "security-report.md", type: "doc", proj: "p1", projName: "AI SaaS Platform", worker: "Kimi Analyzer", workerType: "kimi-cli", task: "Security audit - auth flow", size: "28 KB", date: "1h ago", recency: 2, status: "review", tags: ["security"] },
  { id: "f4", name: "email-templates.html", type: "code", proj: "p2", projName: "Marketing Automation", worker: "Claude Opus", workerType: "claude-cli", task: "Create landing page copy", size: "8 KB", date: "30m ago", recency: 1, status: "approved", tags: ["frontend"] },
  { id: "f5", name: "er-diagram.png", type: "image", proj: "p1", projName: "AI SaaS Platform", worker: "Claude Opus", workerType: "claude-cli", task: "Design database schema", size: "128 KB", date: "2h ago", recency: 4, status: "approved", tags: ["backend"] },
  { id: "f6", name: "migration-001.sql", type: "code", proj: "p1", projName: "AI SaaS Platform", worker: "Claude Opus", workerType: "claude-cli", task: "Design database schema", size: "1.8 KB", date: "2h ago", recency: 3, status: "approved", tags: ["backend", "db"] },
  { id: "f7", name: "pipeline-config.yml", type: "code", proj: "p3", projName: "Data Pipeline v2", worker: "Kimi Analyzer", workerType: "kimi-cli", task: "Set up CI/CD pipeline", size: "3.1 KB", date: "1d ago", recency: 6, status: "approved", tags: ["devops"] },
  { id: "f8", name: "api-spec.yaml", type: "doc", proj: "p1", projName: "AI SaaS Platform", worker: null, workerType: null, task: null, size: "22 KB", date: "3d ago", recency: 7, status: "uploaded", tags: ["docs"], isUpload: true },
  { id: "f9", name: "brand-guidelines.pdf", type: "doc", proj: null, projName: "Shared", worker: null, workerType: null, task: null, size: "2.4 MB", date: "1w ago", recency: 8, status: "uploaded", tags: ["design"], isUpload: true, isShared: true },
];

export const KNOWLEDGE_INDEX: KnowledgeIndexEntry[] = [
  { id: "ki1", type: "artifact", label: "DB schema for auth module", proj: "AI SaaS Platform", summary: "Postgres schema with users, sessions, roles tables. UUID PKs, RS256 JWT.", tags: ["backend", "db"], updated: "2h ago", tokens: 320 },
  { id: "ki2", type: "memory_fact", label: "JWT decision: RS256 chosen", proj: "AI SaaS Platform", summary: "Team decided on RS256 over HS256 for JWT signing. Supports key rotation.", tags: ["backend", "security"], updated: "2h ago", tokens: 85 },
  { id: "ki3", type: "plugin_data", label: "Stripe MRR — Feb 2026", proj: "AI SaaS Platform", summary: "$4,280 MRR, 38 active subscribers, 2.1% churn. Growing +12% MoM.", tags: ["revenue", "metrics"], updated: "2m ago", tokens: 120 },
  { id: "ki4", type: "file", label: "Competitor analysis (5 companies)", proj: "AI SaaS Platform", summary: "12-page analysis: Linear, Notion, Monday, ClickUp, Asana. Pricing, features, gaps.", tags: ["research", "strategy"], updated: "4h ago", tokens: 450 },
  { id: "ki5", type: "task_output", label: "CI/CD pipeline config", proj: "Data Pipeline v2", summary: "GitHub Actions workflow. Docker build \u2192 Supabase migration \u2192 Vercel deploy.", tags: ["devops", "infra"], updated: "1d ago", tokens: 210 },
  { id: "ki6", type: "memory_fact", label: "N+1 query fix strategy", proj: "Data Pipeline v2", summary: "Identified N+1 in task fetching. Fix: JOIN with eager loading. Target <100ms.", tags: ["performance", "backend"], updated: "30m ago", tokens: 95 },
  { id: "ki7", type: "artifact", label: "Security audit findings", proj: "AI SaaS Platform", summary: "Auth flow audit: no SQL injection found, XSS risk in input fields, CSRF tokens needed.", tags: ["security"], updated: "1h ago", tokens: 380 },
  { id: "ki8", type: "plugin_data", label: "GitHub open issues snapshot", proj: "AI SaaS Platform", summary: "12 open issues, 4 open PRs, 47 commits in last 7 days.", tags: ["dev", "metrics"], updated: "5m ago", tokens: 90 },
];

export const MEMORY_FACTS: MemoryFact[] = [
  { id: "mf1", content: "JWT signing uses RS256 (not HS256) to support key rotation in production. Decision made during auth schema design.", source: "Design database schema", proj: "AI SaaS Platform", date: "2h ago", tags: ["jwt", "auth", "decision"] },
  { id: "mf2", content: "User table uses UUID primary keys instead of serial integers for better security and distributed ID generation.", source: "Design database schema", proj: "AI SaaS Platform", date: "2h ago", tags: ["db", "auth", "decision"] },
  { id: "mf3", content: "Competitor Linear has keyboard-first UX as key differentiator. Orchestria should prioritize \u2318K and shortcuts.", source: "Research competitor pricing", proj: "AI SaaS Platform", date: "4h ago", tags: ["competitive", "ux"] },
  { id: "mf4", content: "N+1 query identified in task fetching endpoint. Fix: replace sequential queries with JOINs. Benchmarked: 450ms \u2192 80ms.", source: "Optimize database queries", proj: "Data Pipeline v2", date: "30m ago", tags: ["performance", "fix"] },
  { id: "mf5", content: "Auth flow has no SQL injection vulnerability. XSS risk found in 2 input fields (task title, note content). CSRF tokens not yet implemented.", source: "Security audit - auth flow", proj: "AI SaaS Platform", date: "1h ago", tags: ["security", "finding"] },
  { id: "mf6", content: "Free tier pricing: 100 tasks/day, 1 project. Pro: $29/mo unlimited. Team: $49/mo/seat. Based on competitor analysis.", source: "Research competitor pricing", proj: "AI SaaS Platform", date: "4h ago", tags: ["pricing", "decision"] },
];

export const COMPACTION_LOG: CompactionLogEntry[] = [
  { id: "cl1", task: "Design database schema", run: "run-047", factsExtracted: 3, stepsDeleted: 12, date: "2h ago", status: "done" },
  { id: "cl2", task: "Research competitor pricing", run: "run-044", factsExtracted: 4, stepsDeleted: 28, date: "4h ago", status: "done" },
  { id: "cl3", task: "Security audit - auth flow", run: "run-051", factsExtracted: 0, stepsDeleted: 0, date: "1h ago", status: "pending", note: "Task still running" },
];
