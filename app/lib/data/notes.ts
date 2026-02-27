import type { Note } from "@/lib/types";

export const NOTES_DATA: Note[] = [
  {
    id: "n1", title: "Payment Integration", proj: "AI SaaS Platform",
    content: "# Payment Integration\n\nStripe as primary payment processor.\nPaddle for EU transactions (VAT handling).\n\n## Key Decisions\n- Monthly + yearly billing\n- Free tier: 100 tasks/day, 1 project\n- Pro: $29/mo, unlimited tasks, 10 projects\n- Team: $49/mo/seat, shared workers\n\n## TODO\n- Set up Stripe test environment\n- Design pricing page\n- Implement webhook handlers",
    proposed: 0, pinned: false, updated: "2h ago",
  },
  {
    id: "n2", title: "Performance Optimization", proj: "Data Pipeline v2",
    content: "# Performance Issues\n\nSlow queries identified in the data pipeline.\n\n## Bottlenecks\n1. N+1 query in task fetching (fix with JOIN)\n2. Missing index on task_runs.created_at\n3. Unoptimized vector search (add IVFFlat index)\n\n## Benchmarks\n- Current: 450ms avg query time\n- Target: <100ms\n- After indexing: ~80ms (tested locally)",
    proposed: 3, pinned: true, updated: "30m ago",
  },
  {
    id: "n3", title: "Competitor Analysis", proj: "AI SaaS Platform",
    content: "# Competitor Gap Analysis\n\nMonday has timeline view we're missing.\nLinear has keyboard-first UX.\nNotion has flexible databases.\n\n## Our Advantages\n- AI-native orchestration\n- Multi-agent support\n- Master Planner (pyramid DAG)\n- Real-time agent monitoring\n\n## Features to Consider\n- Timeline / Gantt view\n- Keyboard shortcuts everywhere\n- Custom fields on tasks",
    proposed: 0, pinned: false, updated: "1d ago",
  },
  {
    id: "n4", title: "API Rate Strategy", proj: "AI SaaS Platform",
    content: "# API Rate Limiting Strategy\n\n## Tiers\n- Free: 100 req/day\n- Pro: 10,000 req/day\n- Team: 50,000 req/day\n- Enterprise: Custom\n\n## Implementation\n- Use Supabase edge functions\n- Redis for rate counting\n- Return X-RateLimit headers\n- Graceful degradation on limit hit",
    proposed: 0, pinned: false, updated: "3d ago",
  },
];
