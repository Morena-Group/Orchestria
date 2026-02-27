"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useBriefings() {
  const [blocks, setBlocks] = useState<string[]>([]);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("briefing_templates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setTemplateId(data.id);
      setBlocks(data.blocks as string[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  const saveTemplate = useCallback(async (name: string, newBlocks: string[]) => {
    setBlocks(newBlocks);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    if (templateId) {
      await supabase.from("briefing_templates").update({ name, blocks: newBlocks }).eq("id", templateId);
    } else {
      const { data } = await supabase
        .from("briefing_templates")
        .insert({ user_id: u.user.id, name, blocks: newBlocks })
        .select()
        .single();
      if (data) setTemplateId(data.id);
    }
  }, [supabase, templateId]);

  return { blocks, loading, setBlocks, saveTemplate, refetch: fetch };
}
