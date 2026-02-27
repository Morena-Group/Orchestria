"use client";

import { useState, useEffect, useCallback } from "react";
import { getClient } from "@/lib/supabase/client";
import { mapChat } from "@/lib/db/mappers";
import { useRealtimeSubscription } from "./use-realtime";
import type { ChatMessage } from "@/lib/types";

export function useChats() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("chats")
      .select("*")
      .order("created_at");
    if (err) { setError(err.message); setLoading(false); return; }
    setMessages((data ?? []).map(mapChat));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime: bot responses appear instantly
  useRealtimeSubscription({
    table: "chats",
    events: ["INSERT"],
    onInsert: (row) => setMessages((prev) =>
      prev.some((m) => m.id === (row as { id: string }).id) ? prev : [...prev, mapChat(row)]
    ),
  });

  const sendMessage = useCallback(async (content: string, role: "user" | "bot" = "user") => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const { data } = await supabase
      .from("chats")
      .insert({ user_id: u.user.id, role, content })
      .select()
      .single();
    if (!data) return null;
    const mapped = mapChat(data);
    setMessages((prev) => [...prev, mapped]);
    return mapped;
  }, [supabase]);

  const clearMessages = useCallback(async () => {
    setMessages([]);
    await supabase.from("chats").delete().neq("id", "");
  }, [supabase]);

  return { messages, loading, error, refetch: fetch, sendMessage, clearMessages, setMessages };
}
