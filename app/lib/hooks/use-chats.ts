"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { mapChat } from "@/lib/db/mappers";
import type { ChatMessage } from "@/lib/types";

export function useChats() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

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
    // Delete all user's chat messages
    await supabase.from("chats").delete().neq("id", "");
  }, [supabase]);

  return { messages, loading, error, refetch: fetch, sendMessage, clearMessages, setMessages };
}
