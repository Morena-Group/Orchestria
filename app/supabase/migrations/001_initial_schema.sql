-- Orchestria: Initial Database Schema
-- Run this in Supabase SQL Editor

-- =============================================================
-- EXTENSIONS
-- =============================================================
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA extensions;

-- =============================================================
-- ENUMS
-- =============================================================
CREATE TYPE task_status AS ENUM (
  'draft', 'pending', 'approved', 'running',
  'awaiting_input', 'review', 'completed', 'failed', 'throttled'
);

CREATE TYPE task_priority AS ENUM ('urgent', 'high', 'medium', 'low');

CREATE TYPE worker_type AS ENUM (
  'claude-cli', 'gemini-cli', 'chatgpt-cli', 'kimi-cli', 'human'
);

CREATE TYPE worker_status AS ENUM ('online', 'offline', 'busy');

CREATE TYPE worker_role AS ENUM ('worker', 'orchestrator', 'both');

CREATE TYPE activity_type AS ENUM (
  'gather', 'build', 'assess', 'synthesize', 'fix'
);

CREATE TYPE knowledge_type AS ENUM (
  'artifact', 'memory_fact', 'plugin_data', 'file', 'task_output'
);

-- =============================================================
-- TABLES
-- =============================================================

-- 1. Projects
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#c9a96e',
  total INT NOT NULL DEFAULT 0,
  done INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Workers
CREATE TABLE workers (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  type worker_type NOT NULL,
  role worker_role NOT NULL DEFAULT 'worker',
  status worker_status NOT NULL DEFAULT 'offline',
  active INT NOT NULL DEFAULT 0,
  done INT NOT NULL DEFAULT 0,
  model TEXT,
  think TEXT,
  is_human BOOLEAN NOT NULL DEFAULT false,
  skills TEXT[] DEFAULT '{}',
  email TEXT,
  contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  status task_status NOT NULL DEFAULT 'draft',
  priority task_priority NOT NULL DEFAULT 'medium',
  worker_id TEXT REFERENCES workers(id) ON DELETE SET NULL,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sub INT NOT NULL DEFAULT 0,
  sub_done INT NOT NULL DEFAULT 0,
  lock BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  block TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Task details
CREATE TABLE task_details (
  task_id TEXT PRIMARY KEY REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  description TEXT NOT NULL DEFAULT '',
  acceptance_criteria TEXT,
  context_data JSONB
);

-- 5. Task subtasks
CREATE TABLE task_subtasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0
);

-- 6. Task comments
CREATE TABLE task_comments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  is_human BOOLEAN NOT NULL DEFAULT true,
  author_type TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Task timeline
CREATE TABLE task_timeline (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Task artifacts
CREATE TABLE task_artifacts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Plans
CREATE TABLE plans (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Planner nodes
CREATE TABLE planner_nodes (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  level INT NOT NULL DEFAULT 0,
  label TEXT NOT NULL,
  status task_status NOT NULL DEFAULT 'draft',
  priority task_priority NOT NULL DEFAULT 'medium',
  worker_id TEXT REFERENCES workers(id) ON DELETE SET NULL,
  activity activity_type,
  review TEXT NOT NULL DEFAULT 'Orchestrator review',
  tags TEXT[] DEFAULT '{}',
  children TEXT[] DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);

-- 11. Plan chats
CREATE TABLE plan_chats (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Notes
CREATE TABLE notes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  content TEXT NOT NULL DEFAULT '',
  proposed INT NOT NULL DEFAULT 0,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Storage files
CREATE TABLE storage_files (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  project_name TEXT,
  worker_name TEXT,
  worker_type worker_type,
  task_name TEXT,
  size TEXT NOT NULL,
  date TEXT NOT NULL,
  recency INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'uploaded',
  tags TEXT[] DEFAULT '{}',
  is_upload BOOLEAN NOT NULL DEFAULT false,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. Knowledge index
CREATE TABLE knowledge_index (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type knowledge_type NOT NULL,
  label TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  summary TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  tokens INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. Memory facts
CREATE TABLE memory_facts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. Notifications
CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  icon TEXT NOT NULL DEFAULT 'Bell',
  color TEXT NOT NULL DEFAULT '#a1a1aa',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. Chat messages (orchestrator chat)
CREATE TABLE chats (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. Widget layouts
CREATE TABLE widget_layouts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  widgets JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. Briefing templates
CREATE TABLE briefing_templates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Default',
  blocks TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. Plugin configs
CREATE TABLE plugin_configs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plugin_id TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🔌',
  cat TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'disconnected',
  auth TEXT NOT NULL DEFAULT 'oauth',
  last_sync TEXT,
  items INT NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#71717a',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. Plugin data
CREATE TABLE plugin_data (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  plugin_config_id TEXT NOT NULL REFERENCES plugin_configs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('metric', 'row')),
  label TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 22. Compaction log
CREATE TABLE compaction_log (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  run TEXT NOT NULL,
  facts_extracted INT NOT NULL DEFAULT 0,
  steps_deleted INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- INDEXES
-- =============================================================
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_worker ON tasks(worker_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_task_subtasks_task ON task_subtasks(task_id);
CREATE INDEX idx_task_comments_task ON task_comments(task_id);
CREATE INDEX idx_task_timeline_task ON task_timeline(task_id);
CREATE INDEX idx_task_artifacts_task ON task_artifacts(task_id);
CREATE INDEX idx_planner_nodes_plan ON planner_nodes(plan_id);
CREATE INDEX idx_plan_chats_plan ON plan_chats(plan_id);
CREATE INDEX idx_notes_project ON notes(project_id);
CREATE INDEX idx_storage_files_project ON storage_files(project_id);
CREATE INDEX idx_knowledge_index_project_type ON knowledge_index(project_id, type);
CREATE INDEX idx_memory_facts_project ON memory_facts(project_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_chats_user ON chats(user_id);
CREATE INDEX idx_plugin_data_config ON plugin_data(plugin_config_id);

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE planner_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE compaction_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies: each user can only access their own data
CREATE POLICY "Users access own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own workers" ON workers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own task_details" ON task_details FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own task_subtasks" ON task_subtasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own task_comments" ON task_comments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own task_timeline" ON task_timeline FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own task_artifacts" ON task_artifacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own plans" ON plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own planner_nodes" ON planner_nodes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own plan_chats" ON plan_chats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own notes" ON notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own storage_files" ON storage_files FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own knowledge_index" ON knowledge_index FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own memory_facts" ON memory_facts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own chats" ON chats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own widget_layouts" ON widget_layouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own briefing_templates" ON briefing_templates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own plugin_configs" ON plugin_configs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own plugin_data" ON plugin_data FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own compaction_log" ON compaction_log FOR ALL USING (auth.uid() = user_id);

-- =============================================================
-- TRIGGERS: auto-update updated_at
-- =============================================================
CREATE TRIGGER handle_updated_at_projects BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_workers BEFORE UPDATE ON workers
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_tasks BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_plans BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_notes BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_knowledge_index BEFORE UPDATE ON knowledge_index
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_widget_layouts BEFORE UPDATE ON widget_layouts
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_briefing_templates BEFORE UPDATE ON briefing_templates
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_plugin_configs BEFORE UPDATE ON plugin_configs
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);

CREATE TRIGGER handle_updated_at_plugin_data BEFORE UPDATE ON plugin_data
  FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime(updated_at);
