-- Orchestria: Seed Data
-- Run AFTER 001_initial_schema.sql
-- Uses a placeholder user_id — after first signup, update with:
--   UPDATE projects SET user_id = '<your-uuid>' WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   (repeat for all tables)

-- First, create a placeholder user in auth.users for FK references
-- NOTE: After your first real signup, run the ownership transfer script at the bottom
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001') THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, instance_id, aud, role)
    VALUES (
      '00000000-0000-0000-0000-000000000001',
      'seed@orchestria.dev',
      '$2a$10$placeholder_hash_not_for_login',
      now(),
      now(),
      now(),
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated'
    );
  END IF;
END $$;

-- Variable for convenience
-- All INSERTs below use the literal UUID directly

-- =============================================================
-- PROJECTS
-- =============================================================
INSERT INTO projects (id, user_id, name, color, total, done) VALUES
  ('p1', '00000000-0000-0000-0000-000000000001', 'AI SaaS Platform', '#c9a96e', 24, 8),
  ('p2', '00000000-0000-0000-0000-000000000001', 'Marketing Automation', '#52525b', 12, 3),
  ('p3', '00000000-0000-0000-0000-000000000001', 'Data Pipeline v2', '#71717a', 18, 15);

-- =============================================================
-- WORKERS
-- =============================================================
INSERT INTO workers (id, user_id, name, type, role, status, active, done, model, think, is_human, skills, email, contact) VALUES
  ('w1', '00000000-0000-0000-0000-000000000001', 'Claude Opus', 'claude-cli', 'both', 'online', 3, 47, 'claude-opus-4', 'deep', false, '{}', NULL, NULL),
  ('w2', '00000000-0000-0000-0000-000000000001', 'Gemini Research', 'gemini-cli', 'worker', 'online', 1, 23, 'gemini-2.5-pro', 'standard', false, '{}', NULL, NULL),
  ('w3', '00000000-0000-0000-0000-000000000001', 'ChatGPT Writer', 'chatgpt-cli', 'worker', 'offline', 0, 15, 'gpt-4o', 'standard', false, '{}', NULL, NULL),
  ('w4', '00000000-0000-0000-0000-000000000001', 'Kimi Analyzer', 'kimi-cli', 'worker', 'busy', 2, 31, 'kimi-k2', 'deep', false, '{}', NULL, NULL),
  ('w5', '00000000-0000-0000-0000-000000000001', 'Michael', 'human', 'worker', 'online', 1, 12, NULL, NULL, true, ARRAY['code-review', 'stakeholder', 'devops'], 'michael@example.com', 'in-app');

-- =============================================================
-- TASKS
-- =============================================================
INSERT INTO tasks (id, user_id, title, status, priority, worker_id, project_id, sub, sub_done, lock, tags, block) VALUES
  ('t1', '00000000-0000-0000-0000-000000000001', 'Design database schema for user auth', 'completed', 'high', 'w1', 'p1', 3, 3, false, ARRAY['backend', 'db'], NULL),
  ('t2', '00000000-0000-0000-0000-000000000001', 'Research competitor pricing models', 'running', 'medium', 'w2', 'p1', 5, 2, false, ARRAY['research'], NULL),
  ('t3', '00000000-0000-0000-0000-000000000001', 'Write API documentation', 'awaiting_input', 'medium', 'w3', 'p1', 0, 0, false, ARRAY['docs'], 'Need API key for testing endpoint authentication'),
  ('t4', '00000000-0000-0000-0000-000000000001', 'Implement Kanban drag-and-drop', 'review', 'high', 'w1', 'p1', 4, 4, false, ARRAY['frontend'], NULL),
  ('t5', '00000000-0000-0000-0000-000000000001', 'Set up CI/CD pipeline', 'pending', 'urgent', 'w4', 'p1', 6, 0, false, ARRAY['devops'], NULL),
  ('t6', '00000000-0000-0000-0000-000000000001', 'Create landing page copy', 'draft', 'low', NULL, 'p1', 0, 0, false, ARRAY['marketing'], NULL),
  ('t7', '00000000-0000-0000-0000-000000000001', 'Optimize database queries', 'approved', 'high', 'w1', 'p1', 3, 0, true, ARRAY['backend', 'perf'], NULL),
  ('t8', '00000000-0000-0000-0000-000000000001', 'Security audit - auth flow', 'running', 'urgent', 'w4', 'p1', 8, 3, false, ARRAY['security'], NULL),
  ('t9', '00000000-0000-0000-0000-000000000001', 'Approve infrastructure budget', 'awaiting_input', 'high', 'w5', 'p1', 0, 0, false, ARRAY['ops'], 'Waiting for Michael to approve AWS spend increase'),
  ('t10', '00000000-0000-0000-0000-000000000001', 'User onboarding flow design', 'throttled', 'medium', 'w2', 'p1', 2, 1, false, ARRAY['ux'], NULL);

-- =============================================================
-- TASK DETAILS (descriptions)
-- =============================================================
INSERT INTO task_details (task_id, user_id, description) VALUES
  ('t1', '00000000-0000-0000-0000-000000000001', 'Design the complete database schema for user authentication including users, sessions, roles, and permissions tables. Must support OAuth providers and 2FA tokens.'),
  ('t2', '00000000-0000-0000-0000-000000000001', 'Research 5 competitor pricing models (Linear, Notion, Monday, ClickUp, Asana). Document tiers, limits, and unique selling points.'),
  ('t3', '00000000-0000-0000-0000-000000000001', 'Write comprehensive API documentation covering all endpoints, authentication, rate limits, and error codes. Include code examples in JS and Python.'),
  ('t4', '00000000-0000-0000-0000-000000000001', 'Implement drag-and-drop Kanban board using React DnD. Support column reordering, task moving between columns, and optimistic updates.'),
  ('t5', '00000000-0000-0000-0000-000000000001', 'Set up GitHub Actions CI/CD pipeline with staging and production environments. Include Docker builds, Supabase migrations, and Vercel deploys.'),
  ('t8', '00000000-0000-0000-0000-000000000001', 'Conduct security audit of the authentication flow. Check for SQL injection, XSS, CSRF, session hijacking, and rate limit bypass.'),
  ('t9', '00000000-0000-0000-0000-000000000001', 'Review and approve the proposed AWS infrastructure spend increase from $200/mo to $500/mo for production scaling.');

-- =============================================================
-- TASK SUBTASKS
-- =============================================================
INSERT INTO task_subtasks (user_id, task_id, label, done, sort_order) VALUES
  -- t1 (3 subtasks, all done)
  ('00000000-0000-0000-0000-000000000001', 't1', 'Create users table with UUID PKs', true, 0),
  ('00000000-0000-0000-0000-000000000001', 't1', 'Add sessions table with JWT storage', true, 1),
  ('00000000-0000-0000-0000-000000000001', 't1', 'Define roles & permissions tables', true, 2),
  -- t2 (5 subtasks, 2 done)
  ('00000000-0000-0000-0000-000000000001', 't2', 'Analyze Linear pricing & features', true, 0),
  ('00000000-0000-0000-0000-000000000001', 't2', 'Analyze Notion pricing & features', true, 1),
  ('00000000-0000-0000-0000-000000000001', 't2', 'Analyze Monday pricing & features', false, 2),
  ('00000000-0000-0000-0000-000000000001', 't2', 'Compare feature matrices', false, 3),
  ('00000000-0000-0000-0000-000000000001', 't2', 'Write final pricing recommendation', false, 4),
  -- t4 (4 subtasks, all done)
  ('00000000-0000-0000-0000-000000000001', 't4', 'Set up React DnD provider', true, 0),
  ('00000000-0000-0000-0000-000000000001', 't4', 'Implement column drag handles', true, 1),
  ('00000000-0000-0000-0000-000000000001', 't4', 'Add card drag between columns', true, 2),
  ('00000000-0000-0000-0000-000000000001', 't4', 'Optimistic UI updates on drop', true, 3),
  -- t5 (6 subtasks, 0 done)
  ('00000000-0000-0000-0000-000000000001', 't5', 'Configure GitHub Actions workflow', false, 0),
  ('00000000-0000-0000-0000-000000000001', 't5', 'Set up Docker build pipeline', false, 1),
  ('00000000-0000-0000-0000-000000000001', 't5', 'Add Supabase migration step', false, 2),
  ('00000000-0000-0000-0000-000000000001', 't5', 'Configure Vercel deployment', false, 3),
  ('00000000-0000-0000-0000-000000000001', 't5', 'Add staging environment', false, 4),
  ('00000000-0000-0000-0000-000000000001', 't5', 'Add production environment', false, 5),
  -- t8 (8 subtasks, 3 done)
  ('00000000-0000-0000-0000-000000000001', 't8', 'Test SQL injection vectors', true, 0),
  ('00000000-0000-0000-0000-000000000001', 't8', 'Check XSS in input fields', true, 1),
  ('00000000-0000-0000-0000-000000000001', 't8', 'Verify CSRF token implementation', true, 2),
  ('00000000-0000-0000-0000-000000000001', 't8', 'Test session hijacking scenarios', false, 3),
  ('00000000-0000-0000-0000-000000000001', 't8', 'Audit rate limiting logic', false, 4),
  ('00000000-0000-0000-0000-000000000001', 't8', 'Check password hashing strength', false, 5),
  ('00000000-0000-0000-0000-000000000001', 't8', 'Review OAuth token storage', false, 6),
  ('00000000-0000-0000-0000-000000000001', 't8', 'Test 2FA bypass attempts', false, 7),
  -- t10 (2 subtasks, 1 done)
  ('00000000-0000-0000-0000-000000000001', 't10', 'Design onboarding wizard layout', true, 0),
  ('00000000-0000-0000-0000-000000000001', 't10', 'Implement step progress indicator', false, 1);

-- =============================================================
-- TASK COMMENTS
-- =============================================================
INSERT INTO task_comments (id, user_id, task_id, author, is_human, author_type, content, created_at) VALUES
  ('c1', '00000000-0000-0000-0000-000000000001', 't1', 'Michael', true, NULL, 'Looks good, but add a refresh_token column to sessions table.', now() - interval '30 minutes'),
  ('c2', '00000000-0000-0000-0000-000000000001', 't1', 'Claude Opus', false, 'claude-cli', 'Good catch. I''ll add refresh_token (TEXT) and refresh_token_expires_at (TIMESTAMPTZ) to the sessions table. Updating schema now.', now() - interval '29 minutes');

-- =============================================================
-- TASK TIMELINE
-- =============================================================
INSERT INTO task_timeline (user_id, task_id, event_type, actor, content, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 't1', 'step', 'Claude Opus', 'Started analyzing existing auth tables', now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000001', 't1', 'step', 'Claude Opus', 'Queried Supabase schema for current user table structure', now() - interval '119 minutes'),
  ('00000000-0000-0000-0000-000000000001', 't1', 'tool', 'Claude Opus', 'Tool call: supabase.query(''SELECT * FROM information_schema.tables'')', now() - interval '118 minutes'),
  ('00000000-0000-0000-0000-000000000001', 't1', 'decision', 'Claude Opus', 'Decision: Use UUID for user IDs instead of serial integers for better security', now() - interval '117 minutes'),
  ('00000000-0000-0000-0000-000000000001', 't1', 'step', 'Claude Opus', 'Designed sessions table with JWT token storage and expiry', now() - interval '115 minutes'),
  ('00000000-0000-0000-0000-000000000001', 't1', 'output', 'Claude Opus', 'Generated schema.sql with 4 tables: users, sessions, roles, user_roles', now() - interval '112 minutes'),
  ('00000000-0000-0000-0000-000000000001', 't1', 'status', 'System', 'Task moved to Review', now() - interval '111 minutes'),
  ('00000000-0000-0000-0000-000000000001', 't1', 'comment', 'Michael', 'Looks good, but add a refresh_token column to sessions', now() - interval '108 minutes');

-- =============================================================
-- TASK ARTIFACTS
-- =============================================================
INSERT INTO task_artifacts (user_id, task_id, name, type, size, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 't1', 'schema.sql', 'code', '4.2 KB', now() - interval '112 minutes'),
  ('00000000-0000-0000-0000-000000000001', 't1', 'er-diagram.png', 'image', '128 KB', now() - interval '113 minutes'),
  ('00000000-0000-0000-0000-000000000001', 't1', 'migration-001.sql', 'code', '1.8 KB', now() - interval '111 minutes');

-- =============================================================
-- PLANS
-- =============================================================
INSERT INTO plans (id, user_id, name, created_at) VALUES
  ('plan1', '00000000-0000-0000-0000-000000000001', 'Auth System Overhaul', now() - interval '3 days'),
  ('plan2', '00000000-0000-0000-0000-000000000001', 'Stripe Integration', now() - interval '7 days'),
  ('plan3', '00000000-0000-0000-0000-000000000001', 'Q1 Marketing Push', now() - interval '12 days');

-- =============================================================
-- PLANNER NODES (pyramid for plan1)
-- =============================================================
INSERT INTO planner_nodes (id, user_id, plan_id, level, label, status, priority, worker_id, activity, review, tags, children, description, sort_order) VALUES
  ('r0', '00000000-0000-0000-0000-000000000001', 'plan1', 0, 'Auth System Overhaul', 'running', 'urgent', NULL, NULL, 'Orchestrator decides', ARRAY['master-plan'], ARRAY['r1', 'r2'], 'Complete auth system overhaul with JWT, OAuth, 2FA', 0),
  ('r1', '00000000-0000-0000-0000-000000000001', 'plan1', 1, 'Research & Architecture', 'completed', 'high', 'w2', 'gather', 'Orchestrator review', ARRAY['research'], ARRAY['r3', 'r4'], 'Analyze requirements and design schemas', 1),
  ('r2', '00000000-0000-0000-0000-000000000001', 'plan1', 1, 'Implementation', 'running', 'high', 'w1', 'build', 'Human Review', ARRAY['dev'], ARRAY['r5', 'r6', 'r7'], 'Build all auth components', 2),
  ('r3', '00000000-0000-0000-0000-000000000001', 'plan1', 2, 'Vulnerability analysis report', 'completed', 'medium', 'w2', 'gather', 'Orchestrator review', ARRAY['security'], '{}', 'Map attack surface and document findings', 3),
  ('r4', '00000000-0000-0000-0000-000000000001', 'plan1', 2, 'Auth schema design doc', 'completed', 'high', 'w1', 'synthesize', 'Human Review', ARRAY['backend', 'db'], '{}', 'User, session, token table specs', 4),
  ('r5', '00000000-0000-0000-0000-000000000001', 'plan1', 2, 'JWT service', 'running', 'high', 'w1', 'build', 'Human Review', ARRAY['backend'], ARRAY['r8', 'r9'], 'Token generation and validation', 5),
  ('r6', '00000000-0000-0000-0000-000000000001', 'plan1', 2, 'OAuth providers', 'pending', 'medium', 'w1', 'build', 'Orchestrator review', ARRAY['backend'], '{}', 'Google, GitHub OAuth integration', 6),
  ('r7', '00000000-0000-0000-0000-000000000001', 'plan1', 2, '2FA module', 'draft', 'medium', 'w4', 'build', 'Human Review', ARRAY['security'], '{}', 'TOTP and SMS fallback', 7),
  ('r8', '00000000-0000-0000-0000-000000000001', 'plan1', 3, 'Token generation', 'running', 'high', 'w1', 'build', 'Orchestrator review', ARRAY['backend'], '{}', 'JWT creation with RS256', 8),
  ('r9', '00000000-0000-0000-0000-000000000001', 'plan1', 3, 'Token validation middleware', 'pending', 'high', 'w1', 'assess', 'Orchestrator review', ARRAY['backend'], '{}', 'Validate and test JWT verify middleware', 9);

-- =============================================================
-- PLAN CHATS
-- =============================================================
INSERT INTO plan_chats (user_id, plan_id, role, content, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'plan1', 'user', 'Break down the auth system into phases. JWT first, then OAuth.', now() - interval '3 hours'),
  ('00000000-0000-0000-0000-000000000001', 'plan1', 'bot', E'I''ve created a pyramid plan:\n\nLevel 0: Auth System Overhaul\nLevel 1: Research & Architecture → Implementation\nLevel 2: Individual components (JWT, OAuth, 2FA)\nLevel 3: Granular subtasks\n\nJWT service is prioritized. Want me to add testing phases?', now() - interval '179 minutes'),
  ('00000000-0000-0000-0000-000000000001', 'plan1', 'user', 'Yes, add testing as Level 1 after Implementation', now() - interval '178 minutes');

-- =============================================================
-- NOTES
-- =============================================================
INSERT INTO notes (id, user_id, title, project_id, content, proposed, pinned, updated_at) VALUES
  ('n1', '00000000-0000-0000-0000-000000000001', 'Payment Integration', 'p1',
   E'# Payment Integration\n\nStripe as primary payment processor.\nPaddle for EU transactions (VAT handling).\n\n## Key Decisions\n- Monthly + yearly billing\n- Free tier: 100 tasks/day, 1 project\n- Pro: $29/mo, unlimited tasks, 10 projects\n- Team: $49/mo/seat, shared workers\n\n## TODO\n- Set up Stripe test environment\n- Design pricing page\n- Implement webhook handlers',
   0, false, now() - interval '2 hours'),
  ('n2', '00000000-0000-0000-0000-000000000001', 'Performance Optimization', 'p3',
   E'# Performance Issues\n\nSlow queries identified in the data pipeline.\n\n## Bottlenecks\n1. N+1 query in task fetching (fix with JOIN)\n2. Missing index on task_runs.created_at\n3. Unoptimized vector search (add IVFFlat index)\n\n## Benchmarks\n- Current: 450ms avg query time\n- Target: <100ms\n- After indexing: ~80ms (tested locally)',
   3, true, now() - interval '30 minutes'),
  ('n3', '00000000-0000-0000-0000-000000000001', 'Competitor Analysis', 'p1',
   E'# Competitor Gap Analysis\n\nMonday has timeline view we''re missing.\nLinear has keyboard-first UX.\nNotion has flexible databases.\n\n## Our Advantages\n- AI-native orchestration\n- Multi-agent support\n- Master Planner (pyramid DAG)\n- Real-time agent monitoring\n\n## Features to Consider\n- Timeline / Gantt view\n- Keyboard shortcuts everywhere\n- Custom fields on tasks',
   0, false, now() - interval '1 day'),
  ('n4', '00000000-0000-0000-0000-000000000001', 'API Rate Strategy', 'p1',
   E'# API Rate Limiting Strategy\n\n## Tiers\n- Free: 100 req/day\n- Pro: 10,000 req/day\n- Team: 50,000 req/day\n- Enterprise: Custom\n\n## Implementation\n- Use Supabase edge functions\n- Redis for rate counting\n- Return X-RateLimit headers\n- Graceful degradation on limit hit',
   0, false, now() - interval '3 days');

-- =============================================================
-- CHAT MESSAGES (orchestrator chat)
-- =============================================================
INSERT INTO chats (id, user_id, role, content, created_at) VALUES
  ('m1', '00000000-0000-0000-0000-000000000001', 'user', 'Can you break down the authentication module into subtasks?', now() - interval '4 hours'),
  ('m2', '00000000-0000-0000-0000-000000000001', 'bot', E'I''ll decompose the auth module:\n\n1. **DB schema** — User table, sessions (Claude)\n2. **JWT** — Token generation, validation (Claude)\n3. **OAuth** — Google, GitHub (Gemini)\n4. **Password hashing** — bcrypt (ChatGPT)\n5. **Rate limiting** — Login throttling (Kimi)\n\nCreate these as tasks?', now() - interval '239 minutes'),
  ('m3', '00000000-0000-0000-0000-000000000001', 'user', 'Yes, but assign OAuth to Claude. Also add 2FA.', now() - interval '237 minutes'),
  ('m4', '00000000-0000-0000-0000-000000000001', 'bot', E'Done! Created 6 subtasks under ''Auth Module''. All in Draft.\n\nSet up dependencies? JWT should finish before OAuth and 2FA.', now() - interval '237 minutes');

-- =============================================================
-- NOTIFICATIONS
-- =============================================================
INSERT INTO notifications (id, user_id, type, title, description, time, read, icon, color) VALUES
  ('notif1', '00000000-0000-0000-0000-000000000001', 'completed', 'Task completed', '''Design database schema'' finished by Claude Opus', '2m ago', false, 'CheckCircle2', '#a1a1aa'),
  ('notif2', '00000000-0000-0000-0000-000000000001', 'blocked', 'Agent blocked', 'ChatGPT Writer needs API key for ''Write API documentation''', '15m ago', false, 'AlertTriangle', '#f87171'),
  ('notif3', '00000000-0000-0000-0000-000000000001', 'review', 'Ready for review', '''Implement Kanban drag-and-drop'' awaiting your approval', '1h ago', false, 'Eye', '#c9a96e'),
  ('notif4', '00000000-0000-0000-0000-000000000001', 'completed', 'Task completed', '''Research competitor pricing'' finished by Gemini Research', '2h ago', true, 'CheckCircle2', '#a1a1aa'),
  ('notif5', '00000000-0000-0000-0000-000000000001', 'system', 'Rate limit warning', 'Claude Opus approaching 80% of daily token budget', '3h ago', true, 'AlertTriangle', '#c9a96e'),
  ('notif6', '00000000-0000-0000-0000-000000000001', 'plan', 'Plan stage completed', '''Research & Architecture'' phase fully completed', '4h ago', true, 'Workflow', '#a1a1aa');

-- =============================================================
-- STORAGE FILES
-- =============================================================
INSERT INTO storage_files (id, user_id, name, type, project_id, project_name, worker_name, worker_type, task_name, size, date, recency, status, tags, is_upload, is_shared) VALUES
  ('f1', '00000000-0000-0000-0000-000000000001', 'schema.sql', 'code', 'p1', 'AI SaaS Platform', 'Claude Opus', 'claude-cli', 'Design database schema', '4.2 KB', '2h ago', 3, 'approved', ARRAY['backend', 'db'], false, false),
  ('f2', '00000000-0000-0000-0000-000000000001', 'competitor-analysis.md', 'doc', 'p1', 'AI SaaS Platform', 'Gemini Research', 'gemini-cli', 'Research competitor pricing', '45 KB', '4h ago', 5, 'review', ARRAY['research'], false, false),
  ('f3', '00000000-0000-0000-0000-000000000001', 'security-report.md', 'doc', 'p1', 'AI SaaS Platform', 'Kimi Analyzer', 'kimi-cli', 'Security audit - auth flow', '28 KB', '1h ago', 2, 'review', ARRAY['security'], false, false),
  ('f4', '00000000-0000-0000-0000-000000000001', 'email-templates.html', 'code', 'p2', 'Marketing Automation', 'Claude Opus', 'claude-cli', 'Create landing page copy', '8 KB', '30m ago', 1, 'approved', ARRAY['frontend'], false, false),
  ('f5', '00000000-0000-0000-0000-000000000001', 'er-diagram.png', 'image', 'p1', 'AI SaaS Platform', 'Claude Opus', 'claude-cli', 'Design database schema', '128 KB', '2h ago', 4, 'approved', ARRAY['backend'], false, false),
  ('f6', '00000000-0000-0000-0000-000000000001', 'migration-001.sql', 'code', 'p1', 'AI SaaS Platform', 'Claude Opus', 'claude-cli', 'Design database schema', '1.8 KB', '2h ago', 3, 'approved', ARRAY['backend', 'db'], false, false),
  ('f7', '00000000-0000-0000-0000-000000000001', 'pipeline-config.yml', 'code', 'p3', 'Data Pipeline v2', 'Kimi Analyzer', 'kimi-cli', 'Set up CI/CD pipeline', '3.1 KB', '1d ago', 6, 'approved', ARRAY['devops'], false, false),
  ('f8', '00000000-0000-0000-0000-000000000001', 'api-spec.yaml', 'doc', 'p1', 'AI SaaS Platform', NULL, NULL, NULL, '22 KB', '3d ago', 7, 'uploaded', ARRAY['docs'], true, false),
  ('f9', '00000000-0000-0000-0000-000000000001', 'brand-guidelines.pdf', 'doc', NULL, 'Shared', NULL, NULL, NULL, '2.4 MB', '1w ago', 8, 'uploaded', ARRAY['design'], true, true);

-- =============================================================
-- KNOWLEDGE INDEX
-- =============================================================
INSERT INTO knowledge_index (id, user_id, type, label, project_id, summary, tags, tokens) VALUES
  ('ki1', '00000000-0000-0000-0000-000000000001', 'artifact', 'DB schema for auth module', 'p1', 'Postgres schema with users, sessions, roles tables. UUID PKs, RS256 JWT.', ARRAY['backend', 'db'], 320),
  ('ki2', '00000000-0000-0000-0000-000000000001', 'memory_fact', 'JWT decision: RS256 chosen', 'p1', 'Team decided on RS256 over HS256 for JWT signing. Supports key rotation.', ARRAY['backend', 'security'], 85),
  ('ki3', '00000000-0000-0000-0000-000000000001', 'plugin_data', 'Stripe MRR — Feb 2026', 'p1', '$4,280 MRR, 38 active subscribers, 2.1% churn. Growing +12% MoM.', ARRAY['revenue', 'metrics'], 120),
  ('ki4', '00000000-0000-0000-0000-000000000001', 'file', 'Competitor analysis (5 companies)', 'p1', '12-page analysis: Linear, Notion, Monday, ClickUp, Asana. Pricing, features, gaps.', ARRAY['research', 'strategy'], 450),
  ('ki5', '00000000-0000-0000-0000-000000000001', 'task_output', 'CI/CD pipeline config', 'p3', 'GitHub Actions workflow. Docker build → Supabase migration → Vercel deploy.', ARRAY['devops', 'infra'], 210),
  ('ki6', '00000000-0000-0000-0000-000000000001', 'memory_fact', 'N+1 query fix strategy', 'p3', 'Identified N+1 in task fetching. Fix: JOIN with eager loading. Target <100ms.', ARRAY['performance', 'backend'], 95),
  ('ki7', '00000000-0000-0000-0000-000000000001', 'artifact', 'Security audit findings', 'p1', 'Auth flow audit: no SQL injection found, XSS risk in input fields, CSRF tokens needed.', ARRAY['security'], 380),
  ('ki8', '00000000-0000-0000-0000-000000000001', 'plugin_data', 'GitHub open issues snapshot', 'p1', '12 open issues, 4 open PRs, 47 commits in last 7 days.', ARRAY['dev', 'metrics'], 90);

-- =============================================================
-- MEMORY FACTS
-- =============================================================
INSERT INTO memory_facts (id, user_id, content, source, project_id, tags) VALUES
  ('mf1', '00000000-0000-0000-0000-000000000001', 'JWT signing uses RS256 (not HS256) to support key rotation in production. Decision made during auth schema design.', 'Design database schema', 'p1', ARRAY['jwt', 'auth', 'decision']),
  ('mf2', '00000000-0000-0000-0000-000000000001', 'User table uses UUID primary keys instead of serial integers for better security and distributed ID generation.', 'Design database schema', 'p1', ARRAY['db', 'auth', 'decision']),
  ('mf3', '00000000-0000-0000-0000-000000000001', 'Competitor Linear has keyboard-first UX as key differentiator. Orchestria should prioritize ⌘K and shortcuts.', 'Research competitor pricing', 'p1', ARRAY['competitive', 'ux']),
  ('mf4', '00000000-0000-0000-0000-000000000001', 'N+1 query identified in task fetching endpoint. Fix: replace sequential queries with JOINs. Benchmarked: 450ms → 80ms.', 'Optimize database queries', 'p3', ARRAY['performance', 'fix']),
  ('mf5', '00000000-0000-0000-0000-000000000001', 'Auth flow has no SQL injection vulnerability. XSS risk found in 2 input fields (task title, note content). CSRF tokens not yet implemented.', 'Security audit - auth flow', 'p1', ARRAY['security', 'finding']),
  ('mf6', '00000000-0000-0000-0000-000000000001', 'Free tier pricing: 100 tasks/day, 1 project. Pro: $29/mo unlimited. Team: $49/mo/seat. Based on competitor analysis.', 'Research competitor pricing', 'p1', ARRAY['pricing', 'decision']);

-- =============================================================
-- PLUGIN CONFIGS
-- =============================================================
INSERT INTO plugin_configs (id, user_id, plugin_id, name, icon, cat, status, auth, last_sync, items, description, color) VALUES
  ('plg-stripe', '00000000-0000-0000-0000-000000000001', 'plg-stripe', 'Stripe', '💳', 'Payments', 'connected', 'oauth', '2 min ago', 14, 'Revenue, charges, subscriptions', '#635bff'),
  ('plg-github', '00000000-0000-0000-0000-000000000001', 'plg-github', 'GitHub', '🐙', 'Dev Tools', 'connected', 'oauth', '5 min ago', 23, 'Issues, PRs, commits', '#238636'),
  ('plg-slack', '00000000-0000-0000-0000-000000000001', 'plg-slack', 'Slack', '💬', 'Communication', 'connected', 'oauth', '1 min ago', 8, 'Messages, channels, alerts', '#e01e5a');

-- =============================================================
-- PLUGIN DATA
-- =============================================================
-- Stripe metrics
INSERT INTO plugin_data (id, user_id, plugin_config_id, type, label, data) VALUES
  ('sd1', '00000000-0000-0000-0000-000000000001', 'plg-stripe', 'metric', 'MRR', '{"value": "$4,280", "change": "+12%", "changeUp": true}'),
  ('sd2', '00000000-0000-0000-0000-000000000001', 'plg-stripe', 'metric', 'Active Subs', '{"value": "38", "change": "+3", "changeUp": true}'),
  ('sd3', '00000000-0000-0000-0000-000000000001', 'plg-stripe', 'metric', 'Churn Rate', '{"value": "2.1%", "change": "-0.3%", "changeUp": true}'),
  ('sd4', '00000000-0000-0000-0000-000000000001', 'plg-stripe', 'row', 'Last 5 Charges', '{"rows": [{"name": "Pro Plan — john@acme.co", "amount": "$49", "date": "Today 14:22", "status": "succeeded"}, {"name": "Pro Plan — lisa@startup.io", "amount": "$49", "date": "Today 11:05", "status": "succeeded"}, {"name": "Team Plan — dev@bigco.com", "amount": "$149", "date": "Yesterday", "status": "succeeded"}, {"name": "Pro Plan — max@freelance.dev", "amount": "$49", "date": "Yesterday", "status": "refunded"}, {"name": "Pro Plan — anna@design.co", "amount": "$49", "date": "Feb 23", "status": "succeeded"}]}'),
  -- GitHub metrics
  ('gd1', '00000000-0000-0000-0000-000000000001', 'plg-github', 'metric', 'Open Issues', '{"value": "12", "change": "+2", "changeUp": false}'),
  ('gd2', '00000000-0000-0000-0000-000000000001', 'plg-github', 'metric', 'Open PRs', '{"value": "4", "change": "0", "changeUp": true}'),
  ('gd3', '00000000-0000-0000-0000-000000000001', 'plg-github', 'metric', 'Commits (7d)', '{"value": "47", "change": "+18", "changeUp": true}'),
  ('gd4', '00000000-0000-0000-0000-000000000001', 'plg-github', 'row', 'Recent Issues', '{"rows": [{"name": "#142 — Auth token expires too early", "amount": "bug", "date": "Today", "status": "open"}, {"name": "#141 — Add dark mode to settings", "amount": "feature", "date": "Today", "status": "open"}, {"name": "#140 — Webhook retry fails on 429", "amount": "bug", "date": "Yesterday", "status": "open"}, {"name": "#139 — Migrate to Node 20", "amount": "chore", "date": "Feb 23", "status": "closed"}]}'),
  -- Slack metrics
  ('sld1', '00000000-0000-0000-0000-000000000001', 'plg-slack', 'metric', 'Unread', '{"value": "6", "change": "", "changeUp": true}'),
  ('sld2', '00000000-0000-0000-0000-000000000001', 'plg-slack', 'metric', 'Mentions', '{"value": "3", "change": "today", "changeUp": false}'),
  ('sld3', '00000000-0000-0000-0000-000000000001', 'plg-slack', 'row', 'Recent Mentions', '{"rows": [{"name": "@michael can you review the pricing PR?", "amount": "#dev", "date": "12 min ago", "status": "unread"}, {"name": "@michael standup notes posted", "amount": "#general", "date": "1h ago", "status": "read"}, {"name": "@michael deploy to staging done", "amount": "#deploys", "date": "3h ago", "status": "read"}]}');

-- =============================================================
-- COMPACTION LOG
-- =============================================================
INSERT INTO compaction_log (id, user_id, task_name, run, facts_extracted, steps_deleted, status, note) VALUES
  ('cl1', '00000000-0000-0000-0000-000000000001', 'Design database schema', 'run-047', 3, 12, 'done', NULL),
  ('cl2', '00000000-0000-0000-0000-000000000001', 'Research competitor pricing', 'run-044', 4, 28, 'done', NULL),
  ('cl3', '00000000-0000-0000-0000-000000000001', 'Security audit - auth flow', 'run-051', 0, 0, 'pending', 'Task still running');

-- =============================================================
-- OWNERSHIP TRANSFER SCRIPT
-- =============================================================
-- After your first real signup, run this to transfer all seed data:
--
-- DO $$
-- DECLARE
--   new_uid UUID := '<your-real-user-uuid>';
-- BEGIN
--   UPDATE projects SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE workers SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE tasks SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE task_details SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE task_subtasks SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE task_comments SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE task_timeline SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE task_artifacts SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE plans SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE planner_nodes SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE plan_chats SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE notes SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE storage_files SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE knowledge_index SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE memory_facts SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE notifications SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE chats SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE widget_layouts SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE briefing_templates SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE plugin_configs SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE plugin_data SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   UPDATE compaction_log SET user_id = new_uid WHERE user_id = '00000000-0000-0000-0000-000000000001';
--   -- Optionally delete the placeholder user:
--   -- DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';
-- END $$;
