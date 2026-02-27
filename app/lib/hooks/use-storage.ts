"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { mapStorageFile, mapKnowledgeEntry, mapMemoryFact, mapCompactionEntry } from "@/lib/db/mappers";
import type { StorageFile, KnowledgeIndexEntry, MemoryFact, CompactionLogEntry } from "@/lib/types";

export function useStorage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeIndexEntry[]>([]);
  const [memoryFacts, setMemoryFacts] = useState<MemoryFact[]>([]);
  const [compactionLog, setCompactionLog] = useState<CompactionLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);

    const [filesRes, knowledgeRes, factsRes, compactionRes, projectsRes] = await Promise.all([
      supabase.from("storage_files").select("*").order("recency"),
      supabase.from("knowledge_index").select("*").order("updated_at", { ascending: false }),
      supabase.from("memory_facts").select("*").order("created_at", { ascending: false }),
      supabase.from("compaction_log").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("id, name"),
    ]);

    if (filesRes.error || knowledgeRes.error || factsRes.error || compactionRes.error) {
      setError("Failed to load storage data");
      setLoading(false);
      return;
    }

    const projMap = new Map((projectsRes.data ?? []).map((p) => [p.id, p.name]));

    setFiles((filesRes.data ?? []).map(mapStorageFile));
    setKnowledge((knowledgeRes.data ?? []).map((r) => mapKnowledgeEntry(r, projMap.get(r.project_id) ?? "")));
    setMemoryFacts((factsRes.data ?? []).map((r) => mapMemoryFact(r, projMap.get(r.project_id) ?? "")));
    setCompactionLog((compactionRes.data ?? []).map(mapCompactionEntry));
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  return { files, knowledge, memoryFacts, compactionLog, loading, error, refetch: fetch };
}
