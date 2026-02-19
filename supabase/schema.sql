-- ============================================
-- ADHD Client Manager — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active | paused | churned
  contract_type TEXT NOT NULL DEFAULT 'retainer', -- retainer | project-based
  monthly_revenue NUMERIC DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  notes TEXT DEFAULT '',
  color TEXT NOT NULL DEFAULT 'slate', -- slate|violet|blue|teal|amber|rose
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active | complete | paused
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'medium', -- high | medium | low
  done BOOLEAN NOT NULL DEFAULT false,
  recurrence TEXT NOT NULL DEFAULT 'none', -- none | daily | weekly | monthly
  completed_at TIMESTAMPTZ,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users own clients"  ON clients  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users own tasks"    ON tasks    FOR ALL USING (auth.uid() = user_id);

-- Add workflow status to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'not_started';

-- Task notes (append-only history)
CREATE TABLE IF NOT EXISTS task_notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE task_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users own task_notes" ON task_notes FOR ALL USING (auth.uid() = user_id);
