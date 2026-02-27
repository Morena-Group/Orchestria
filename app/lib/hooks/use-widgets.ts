"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useWidgets() {
  const [widgets, setWidgets] = useState<string[]>([]);
  const [layoutId, setLayoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("widget_layouts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setLayoutId(data.id);
      setWidgets(data.widgets as string[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  const saveLayout = useCallback(async (newWidgets: string[]) => {
    setWidgets(newWidgets);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    if (layoutId) {
      await supabase.from("widget_layouts").update({ widgets: newWidgets }).eq("id", layoutId);
    } else {
      const { data } = await supabase
        .from("widget_layouts")
        .insert({ user_id: u.user.id, widgets: newWidgets })
        .select()
        .single();
      if (data) setLayoutId(data.id);
    }
  }, [supabase, layoutId]);

  return { widgets, loading, saveLayout, refetch: fetch };
}
