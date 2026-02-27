import type { PlanNode, Plan, PlanTemplate, PlanChat } from "@/lib/types";

export const PYRAMID: PlanNode[] = [
  { id: "r0", level: 0, label: "Auth System Overhaul", status: "running", priority: "urgent", worker: null, act: null, review: "Orchestrator decides", tags: ["master-plan"], children: ["r1", "r2"], description: "Complete auth system overhaul with JWT, OAuth, 2FA" },
  { id: "r1", level: 1, label: "Research & Architecture", status: "completed", priority: "high", worker: "w2", act: "gather", review: "Orchestrator review", tags: ["research"], children: ["r3", "r4"], description: "Analyze requirements and design schemas" },
  { id: "r2", level: 1, label: "Implementation", status: "running", priority: "high", worker: "w1", act: "build", review: "Human Review", tags: ["dev"], children: ["r5", "r6", "r7"], description: "Build all auth components" },
  { id: "r3", level: 2, label: "Vulnerability analysis report", status: "completed", priority: "medium", worker: "w2", act: "gather", review: "Orchestrator review", tags: ["security"], children: [], description: "Map attack surface and document findings" },
  { id: "r4", level: 2, label: "Auth schema design doc", status: "completed", priority: "high", worker: "w1", act: "synthesize", review: "Human Review", tags: ["backend", "db"], children: [], description: "User, session, token table specs" },
  { id: "r5", level: 2, label: "JWT service", status: "running", priority: "high", worker: "w1", act: "build", review: "Human Review", tags: ["backend"], children: ["r8", "r9"], description: "Token generation and validation" },
  { id: "r6", level: 2, label: "OAuth providers", status: "pending", priority: "medium", worker: "w1", act: "build", review: "Orchestrator review", tags: ["backend"], children: [], description: "Google, GitHub OAuth integration" },
  { id: "r7", level: 2, label: "2FA module", status: "draft", priority: "medium", worker: "w4", act: "build", review: "Human Review", tags: ["security"], children: [], description: "TOTP and SMS fallback" },
  { id: "r8", level: 3, label: "Token generation", status: "running", priority: "high", worker: "w1", act: "build", review: "Orchestrator review", tags: ["backend"], children: [], description: "JWT creation with RS256" },
  { id: "r9", level: 3, label: "Token validation middleware", status: "pending", priority: "high", worker: "w1", act: "assess", review: "Orchestrator review", tags: ["backend"], children: [], description: "Validate and test JWT verify middleware" },
];

export const PLANS: Plan[] = [
  { id: "plan1", name: "Auth System Overhaul", created: "Feb 24" },
  { id: "plan2", name: "Stripe Integration", created: "Feb 20" },
  { id: "plan3", name: "Q1 Marketing Push", created: "Feb 15" },
];

export const PLAN_TEMPLATES: PlanTemplate[] = [
  { id: "blank", name: "Blank Plan", desc: "Start from scratch", icon: "\u{1F4CB}" },
  { id: "saas", name: "SaaS Feature", desc: "Gather \u2192 Build \u2192 Assess \u2192 Deploy", icon: "\u{1F680}" },
  { id: "research", name: "Deep Research", desc: "Gather \u2192 Synthesize \u2192 Assess \u2192 Report", icon: "\u{1F52C}" },
  { id: "migration", name: "Migration", desc: "Gather \u2192 Build \u2192 Assess \u2192 Fix \u2192 Deploy", icon: "\u{1F504}" },
  { id: "security", name: "Security Audit", desc: "Gather \u2192 Assess \u2192 Fix \u2192 Synthesize", icon: "\u{1F6E1}\uFE0F" },
];

export const PLAN_CHATS: PlanChat[] = [
  { role: "user", content: "Break down the auth system into phases. JWT first, then OAuth.", time: "10:15 AM" },
  { role: "bot", content: "I've created a pyramid plan:\n\nLevel 0: Auth System Overhaul\nLevel 1: Research & Architecture \u2192 Implementation\nLevel 2: Individual components (JWT, OAuth, 2FA)\nLevel 3: Granular subtasks\n\nJWT service is prioritized. Want me to add testing phases?", time: "10:16 AM" },
  { role: "user", content: "Yes, add testing as Level 1 after Implementation", time: "10:18 AM" },
];
