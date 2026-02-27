"use client";

import { useState, useEffect, useCallback } from "react";
import { getClient } from "@/lib/supabase/client";
import { mapNotification } from "@/lib/db/mappers";
import { useRealtimeSubscription } from "./use-realtime";
import type { Notification } from "@/lib/types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) { setError(err.message); setLoading(false); return; }
    setNotifications((data ?? []).map(mapNotification));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime: new notifications appear instantly (bell badge)
  useRealtimeSubscription({
    table: "notifications",
    onInsert: (row) => setNotifications((prev) =>
      prev.some((n) => n.id === (row as { id: string }).id) ? prev : [mapNotification(row), ...prev]
    ),
    onUpdate: (row) => setNotifications((prev) =>
      prev.map((n) => n.id === (row as { id: string }).id ? mapNotification(row) : n)
    ),
  });

  const markRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  }, [supabase]);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from("notifications").update({ read: true }).eq("read", false);
  }, [supabase]);

  return { notifications, loading, error, refetch: fetch, markRead, markAllRead };
}
