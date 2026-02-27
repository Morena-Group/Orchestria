"use client";

import { useState, useEffect, useCallback } from "react";
import { getClient } from "@/lib/supabase/client";
import { mapTask, unmapTask } from "@/lib/db/mappers";
import { useRealtimeSubscription } from "./use-realtime";
import type { Task, TaskStatus } from "@/lib/types";

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("tasks").select("*").order("created_at");
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error: err } = await query;
    if (err) { setError(err.message); setLoading(false); return; }
    setTasks((data ?? []).map(mapTask));
    setLoading(false);
  }, [supabase, projectId]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime: live task updates across tabs / from workers
  useRealtimeSubscription({
    table: "tasks",
    filter: projectId ? `project_id=eq.${projectId}` : undefined,
    onInsert: (row) => setTasks((prev) =>
      prev.some((t) => t.id === (row as { id: string }).id) ? prev : [...prev, mapTask(row)]
    ),
    onUpdate: (row) => setTasks((prev) =>
      prev.map((t) => t.id === (row as { id: string }).id ? mapTask(row) : t)
    ),
    onDelete: (old) => setTasks((prev) =>
      prev.filter((t) => t.id !== (old as { id: string }).id)
    ),
  });

  const createTask = useCallback(async (t: Partial<Task>) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const id = `t${Date.now()}`;
    const row = unmapTask(t);
    const { data, error: err } = await supabase
      .from("tasks")
      .insert({ id, user_id: u.user.id, ...row })
      .select()
      .single();
    if (err || !data) return null;
    const mapped = mapTask(data);
    setTasks((prev) => [...prev, mapped]);
    return mapped;
  }, [supabase]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    const { error: err } = await supabase
      .from("tasks")
      .update(unmapTask(updates))
      .eq("id", id);
    if (err) { fetch(); return false; }
    return true;
  }, [supabase, fetch]);

  const updateStatus = useCallback(async (id: string, status: TaskStatus) => {
    return updateTask(id, { s: status });
  }, [updateTask]);

  const deleteTask = useCallback(async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    const { error: err } = await supabase.from("tasks").delete().eq("id", id);
    if (err) { fetch(); return false; }
    return true;
  }, [supabase, fetch]);

  return { tasks, loading, error, refetch: fetch, createTask, updateTask, updateStatus, deleteTask };
}
