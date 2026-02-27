"use client";

import { useState, useEffect, useCallback } from "react";
import { getClient } from "@/lib/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Settings = Record<string, any>;

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [rowId, setRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = getClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setLoading(false); return; }

    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", u.user.id)
      .maybeSingle();

    if (data) {
      setRowId(data.id);
      setSettings(data.settings as Settings);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  const update = useCallback(async (key: string, value: unknown) => {
    // Optimistic update
    setSettings((prev) => ({ ...prev, [key]: value }));

    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const merged = { ...settings, [key]: value };

    if (rowId) {
      await supabase
        .from("user_settings")
        .update({ settings: merged, updated_at: new Date().toISOString() })
        .eq("id", rowId);
    } else {
      const { data } = await supabase
        .from("user_settings")
        .insert({ user_id: u.user.id, settings: merged })
        .select()
        .single();
      if (data) setRowId(data.id);
    }
  }, [supabase, rowId, settings]);

  return { settings, loading, update };
}
