"use client";

import { useState, useEffect, useCallback } from "react";
import { getClient } from "@/lib/supabase/client";
import { mapProject, unmapProject } from "@/lib/db/mappers";
import { useRealtimeSubscription } from "./use-realtime";
import type { Project } from "@/lib/types";

let cache: { data: Project[]; ts: number } | null = null;
const TTL = 30_000;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(cache?.data ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  const supabase = getClient();

  const fetch = useCallback(async (force = false) => {
    if (!force && cache && Date.now() - cache.ts < TTL) {
      setProjects(cache.data);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("projects")
      .select("*")
      .order("created_at");
    if (err) { setError(err.message); setLoading(false); return; }
    const mapped = (data ?? []).map(mapProject);
    cache = { data: mapped, ts: Date.now() };
    setProjects(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime: project changes (done count, new projects)
  useRealtimeSubscription({
    table: "projects",
    onInsert: (row) => {
      cache = null;
      setProjects((prev) =>
        prev.some((p) => p.id === (row as { id: string }).id) ? prev : [...prev, mapProject(row)]
      );
    },
    onUpdate: (row) => {
      cache = null;
      setProjects((prev) =>
        prev.map((p) => p.id === (row as { id: string }).id ? mapProject(row) : p)
      );
    },
    onDelete: (old) => {
      cache = null;
      setProjects((prev) => prev.filter((p) => p.id !== (old as { id: string }).id));
    },
  });

  const createProject = useCallback(async (p: Omit<Project, "id">) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const id = `p${Date.now()}`;
    const { data, error: err } = await supabase
      .from("projects")
      .insert({ id, user_id: u.user.id, ...unmapProject(p) })
      .select()
      .single();
    if (err || !data) return null;
    const mapped = mapProject(data);
    cache = null;
    setProjects((prev) => [...prev, mapped]);
    return mapped;
  }, [supabase]);

  return { projects, loading, error, refetch: () => fetch(true), createProject };
}
