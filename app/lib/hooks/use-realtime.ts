"use client";

import { useEffect, useRef } from "react";
import { getClient } from "@/lib/supabase/client";

type EventType = "INSERT" | "UPDATE" | "DELETE";

interface RealtimeOptions {
  table: string;
  events?: EventType[];
  filter?: string;
  onInsert?: (row: Record<string, unknown>) => void;
  onUpdate?: (row: Record<string, unknown>) => void;
  onDelete?: (old: Record<string, unknown>) => void;
}

export function useRealtimeSubscription(opts: RealtimeOptions) {
  // Store callbacks in refs to avoid resubscribing when they change
  const cbRef = useRef(opts);
  cbRef.current = opts;

  useEffect(() => {
    const supabase = getClient();
    const channelName = `rt-${opts.table}-${Math.random().toString(36).slice(2, 8)}`;

    const events: EventType[] = opts.events ?? ["INSERT", "UPDATE", "DELETE"];
    let channel = supabase.channel(channelName);

    for (const event of events) {
      channel = channel.on(
        "postgres_changes" as never,
        { event, schema: "public", table: opts.table, filter: opts.filter } as never,
        (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => {
          if (event === "INSERT" && cbRef.current.onInsert) cbRef.current.onInsert(payload.new);
          if (event === "UPDATE" && cbRef.current.onUpdate) cbRef.current.onUpdate(payload.new);
          if (event === "DELETE" && cbRef.current.onDelete) cbRef.current.onDelete(payload.old);
        },
      );
    }

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [opts.table, opts.filter]);
}
