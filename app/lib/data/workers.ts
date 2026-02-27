import type { Worker, HumanSkill } from "@/lib/types";

export const WORKERS: Worker[] = [
  { id: "w1", name: "Claude Opus", type: "claude-cli", role: "both", status: "online", active: 3, done: 47, model: "claude-opus-4", think: "deep", isHuman: false },
  { id: "w2", name: "Gemini Research", type: "gemini-cli", role: "worker", status: "online", active: 1, done: 23, model: "gemini-2.5-pro", think: "standard", isHuman: false },
  { id: "w3", name: "ChatGPT Writer", type: "chatgpt-cli", role: "worker", status: "offline", active: 0, done: 15, model: "gpt-4o", think: "standard", isHuman: false },
  { id: "w4", name: "Kimi Analyzer", type: "kimi-cli", role: "worker", status: "busy", active: 2, done: 31, model: "kimi-k2", think: "deep", isHuman: false },
  { id: "w5", name: "Michael", type: "human", role: "worker", status: "online", active: 1, done: 12, model: null, think: null, isHuman: true, skills: ["code-review", "stakeholder", "devops"], email: "michael@example.com", contact: "in-app" },
];

export const HUMAN_SKILLS: HumanSkill[] = [
  { id: "code-review", l: "Code Review", d: "Review code, PRs, technical decisions" },
  { id: "design", l: "Design", d: "UI/UX design, wireframing, visual decisions" },
  { id: "copywriting", l: "Copywriting", d: "Marketing texts, blog posts, communication" },
  { id: "research", l: "Research", d: "Manual research, fact verification" },
  { id: "qa", l: "QA / Testing", d: "Manual testing, bug reporting" },
  { id: "devops", l: "DevOps", d: "Infrastructure, deployment, servers" },
  { id: "data-entry", l: "Data Entry", d: "Manual data input, forms, credentials" },
  { id: "stakeholder", l: "Stakeholder", d: "Approvals, business decisions, budget" },
];
