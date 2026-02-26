# Orchestria — AI-First Project Management

## What is Orchestria

Orchestria is an AI-first task and project management SaaS where AI workers (Claude, Gemini, ChatGPT, Kimi, etc.) execute tasks autonomously while humans orchestrate, approve, and intervene only when needed. Think of it as "a project manager that actually does the work" — you define what needs to happen, Orchestria's AI agents figure out how and do it.

The name "Orchestria" is a play on "orchestra" — you are the conductor, AI agents are the musicians.

## Who is it for

Primary audience: solo founders, indie hackers, and small dev teams (2-10 people) building software products who want to multiply their output through AI automation. These are people who already use AI tools (Cursor, Claude Code, ChatGPT) but lack a unified system to orchestrate multiple AI agents working on interconnected tasks.

## Core value proposition

Instead of managing tasks manually and copy-pasting between AI tools, Orchestria lets you:
- Define tasks and goals in natural language
- Assign them to specialized AI workers (or let the system auto-assign)
- AI workers execute tasks autonomously (write code, research, generate docs, etc.)
- Get notified only when human input is needed (approvals, decisions, blockers)
- See all progress in one dashboard with real-time status

## Key features

- **Dashboard** — real-time overview of all tasks, workers, progress metrics
- **Task management** — create, assign, prioritize tasks with subtasks and dependencies
- **AI Workers** — connect multiple AI models (Claude, Gemini, ChatGPT, Kimi) as autonomous workers with configurable roles (worker, orchestrator, or both)
- **AI Planner** — multi-stage plan generation with visual tree view, AI breaks down goals into executable task plans
- **Chat interface** — natural language commands to the orchestrator ("break down auth module into subtasks")
- **Storage & Knowledge Index** — shared context and files accessible to all workers, two-step retrieval (index scan → targeted fetch)
- **Plugin system** — read-only, config-driven data-pull integrations (Stripe, GitHub, Slack, Google Analytics, Sentry) with user-assembled views
- **Briefings & Notes** — AI-generated reports, meeting notes, project summaries
- **Settings** — worker configs, credentials vault (Open/Gated/Ephemeral tiers), notification preferences

## Monetization

Freemium model with four tiers: Free, Pro, Team, Enterprise. Revenue comes from subscription fees only. Users bring and pay for their own AI API keys — Orchestria never pays for LLM tokens. Our costs are purely infrastructure.

## Tech stack

- **API & MCP Server**: Cloudflare Workers — all agent-facing endpoints, global edge distribution, near-zero cold start, handles polling from workers worldwide
- **Frontend**: Cloudflare Pages — React app (Next.js App Router, Tailwind CSS), auto-deploys from Git, served from edge
- **Database**: Supabase (PostgreSQL) — all structured data: tasks, workers, projects, plugin_data, knowledge_index, memory_facts
- **Vector search**: Supabase pgvector — semantic memory, embeddings for knowledge retrieval
- **File storage**: Supabase Storage — agent outputs, user uploads, artifacts, RLS-protected per tenant
- **Auth**: Supabase Auth — user authentication, JWT tokens, Row Level Security on all tables
- **Real-time**: Supabase Realtime — WebSocket for live task updates, agent progress, notifications to frontend
- **AI integrations**: Users' own API keys for Anthropic (Claude), Google (Gemini), OpenAI (ChatGPT), Moonshot (Kimi)
- **Plugin architecture**: Config-driven JSON plugin definitions, OAuth-first auth, read-only data pull, user-assembled widget views

## Architecture highlights

- **Pull model**: Agents call Orchestria, never the other way around. Works universally behind firewalls.
- **Three connection modes**: MCP Server (recommended, <1s latency), Cron Job (1-5 min, lightweight), Daemon (always-on, <10s)
- **Per-worker tokens**: Format `orch_w{id}_{random}`, bcrypt-hashed, scoped to single worker + single user. Isolation, audit trail, selective revocation.
- **Task lifecycle**: pending → running → review → completed. Compaction extracts memory_facts, deletes raw task_steps.
- **Two-step retrieval**: Knowledge Index scan (cheap, always in context) → targeted full fetch. Orchestrator never loads everything blindly.
- **Context modes**: Full Overview (cross-project breadth), Recency Bias (freshness priority), Custom (user-defined weights, pinned docs)
- **Context token budget**: Configurable (default 8,000 tokens), filled greedily from highest-ranked knowledge.
- **Multi-tenant isolation**: RLS on every table and storage bucket from day one.
- **Plugin system**: Read-only by design. Write actions go through agents with Credentials Vault, not plugins.

## Design system

Dark glassmorphism with warm gold accents — premium, not "vibecoded":
- **Near-black base** (#050507) — true dark background with subtle ambient gold radial gradients
- **Glass surfaces** — `backdrop-filter: blur(24px)` with `rgba(200, 169, 110, 0.03)` tint and `rgba(200, 169, 110, 0.08)` borders
- **Warm gold (#c9a96e)** — all interactive elements, active states, CTAs, gradient buttons with glow
- **Red (#f87171)** — error states only
- **Font**: Inter (Google Fonts), weight 300–700
- **Key effects**: top-edge gold gradient highlights on cards, ambient background glow, hover lift with box-shadow glow, gold dot-shadow on notification/status indicators
- **Philosophy**: "Glass + Gold" — surfaces are translucent with blur, gold provides warmth and focus. Everything else dissolves into the dark background.

Full design tokens documented in `Orchestria-Design-Tokens-v1.docx`.

## Current state

- Fully designed interactive mockup (`orchestria-mockup-v4.jsx`) — 2132 lines, all views built out
- Design system defined and documented
- Architecture fully specified across two documents
- Ready for conversion from mockup to production Next.js application

## Project files

- `orchestria-mockup-v4.jsx` — main interactive mockup (React/JSX, all views)
- `orchestria-design-preview-v2.html` — monochromatic design preview (v2)
- `orchestria-design-preview-v3-glass.html` — approved glassmorphism design preview (current)
- `Orchestria-Design-Tokens-v1.docx` — complete design token reference
- `Orchestria-Technical-Architecture-Infrastructure-API-Workers-Plugins.docx` — infrastructure, API, workers, plugins, onboarding, cost analysis
- `Orchestria-Architecture-Storage-Memory-Context.docx` — database schema, knowledge retrieval, compaction, context modes

## Coding conventions

- TypeScript for all new code
- Tailwind CSS for styling (use design tokens, not arbitrary colors)
- Component-per-file structure
- Use the C (color) theme object for all colors — never hardcode hex values in components
- Shadcn/UI-inspired component patterns (Radix primitives + Tailwind)
- Inter font everywhere, no font mixing
- Supabase client for all DB operations, RLS-aware queries
- Cloudflare Workers for all API endpoints (not Supabase Edge Functions — cold start matters for polling agents)
