"use client";

import { useState, useEffect, useCallback } from "react";
import { getClient } from "@/lib/supabase/client";
import { mapWorker, unmapWorker } from "@/lib/db/mappers";
import { useRealtimeSubscription } from "./use-realtime";
import type { Worker } from "@/lib/types";

let cache: { data: Worker[]; ts: number } | null = null;
const TTL = 30_000;

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>(cache?.data ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  const supabase = getClient();

  const fetch = useCallback(async (force = false) => {
    if (!force && cache && Date.now() - cache.ts < TTL) {
      setWorkers(cache.data);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("workers")
      .select("*")
      .order("created_at");
    if (err) { setError(err.message); setLoading(false); return; }
    const mapped = (data ?? []).map(mapWorker);
    cache = { data: mapped, ts: Date.now() };
    setWorkers(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime: worker status changes, new workers
  useRealtimeSubscription({
    table: "workers",
    onInsert: (row) => {
      cache = null;
      setWorkers((prev) =>
        prev.some((w) => w.id === (row as { id: string }).id) ? prev : [...prev, mapWorker(row)]
      );
    },
    onUpdate: (row) => {
      cache = null;
      setWorkers((prev) =>
        prev.map((w) => w.id === (row as { id: string }).id ? mapWorker(row) : w)
      );
    },
    onDelete: (old) => {
      cache = null;
      setWorkers((prev) => prev.filter((w) => w.id !== (old as { id: string }).id));
    },
  });

  const addWorker = useCallback(async (w: Omit<Worker, "id">) => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const id = `w${Date.now()}`;
    const { data, error: err } = await supabase
      .from("workers")
      .insert({ id, user_id: u.user.id, ...unmapWorker(w) })
      .select()
      .single();
    if (err || !data) return null;
    const mapped = mapWorker(data);
    cache = null;
    setWorkers((prev) => [...prev, mapped]);
    return mapped;
  }, [supabase]);

  const updateWorker = useCallback(async (id: string, updates: Partial<Worker>) => {
    setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
    const { error: err } = await supabase
      .from("workers")
      .update(unmapWorker(updates))
      .eq("id", id);
    if (err) { fetch(true); return false; }
    cache = null;
    return true;
  }, [supabase, fetch]);

  const deleteWorker = useCallback(async (id: string) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
    const { error: err } = await supabase.from("workers").delete().eq("id", id);
    if (err) { fetch(true); return false; }
    cache = null;
    return true;
  }, [supabase, fetch]);

  return { workers, loading, error, refetch: () => fetch(true), addWorker, updateWorker, deleteWorker };
}
