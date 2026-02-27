"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { mapPlugin } from "@/lib/db/mappers";
import type { Plugin } from "@/lib/types";

let cache: { data: Plugin[]; ts: number } | null = null;
const TTL = 30_000;

export function usePlugins() {
  const [plugins, setPlugins] = useState<Plugin[]>(cache?.data ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetch = useCallback(async (force = false) => {
    if (!force && cache && Date.now() - cache.ts < TTL) {
      setPlugins(cache.data);
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: configs, error: cfgErr } = await supabase
      .from("plugin_configs")
      .select("*")
      .order("created_at");

    if (cfgErr) { setError(cfgErr.message); setLoading(false); return; }

    const { data: allData, error: dataErr } = await supabase
      .from("plugin_data")
      .select("*")
      .order("created_at");

    if (dataErr) { setError(dataErr.message); setLoading(false); return; }

    const mapped = (configs ?? []).map((cfg) => {
      const pluginData = (allData ?? []).filter((d) => d.plugin_config_id === cfg.id);
      return mapPlugin(cfg, pluginData);
    });

    cache = { data: mapped, ts: Date.now() };
    setPlugins(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  return { plugins, loading, error, refetch: () => fetch(true) };
}
