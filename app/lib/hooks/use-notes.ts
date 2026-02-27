"use client";

import { useState, useEffect, useCallback } from "react";
import { getClient } from "@/lib/supabase/client";
import { mapNote, unmapNote } from "@/lib/db/mappers";
import { useRealtimeSubscription } from "./use-realtime";
import type { Note } from "@/lib/types";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getClient();

  const fetch = useCallback(async () => {
    setLoading(true);

    // Fetch notes with project name via a join
    const { data, error: err } = await supabase
      .from("notes")
      .select("*, projects(name)")
      .order("updated_at", { ascending: false });

    if (err) { setError(err.message); setLoading(false); return; }

    const mapped = (data ?? []).map((row: Record<string, unknown>) => {
      const projName = (row.projects as { name: string } | null)?.name ?? "";
      return mapNote(row, projName);
    });
    setNotes(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime: note changes from other tabs
  // Note: realtime rows don't include joined project name,
  // so we look it up from existing notes or refetch
  useRealtimeSubscription({
    table: "notes",
    onInsert: (row) => {
      const r = row as { id: string; project_id?: string };
      if (notes.some((n) => n.id === r.id)) return;
      // Refetch to get the joined project name
      fetch();
    },
    onUpdate: (row) => {
      const r = row as { id: string; project_id?: string };
      // Find existing note to preserve project name
      const existing = notes.find((n) => n.id === r.id);
      const projName = existing?.proj ?? "";
      setNotes((prev) =>
        prev.map((n) => n.id === r.id ? mapNote(row, projName) : n)
      );
    },
    onDelete: (old) => setNotes((prev) =>
      prev.filter((n) => n.id !== (old as { id: string }).id)
    ),
  });

  const createNote = useCallback(async (title: string, projectId: string, content = "") => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const { data } = await supabase
      .from("notes")
      .insert({ user_id: u.user.id, title, project_id: projectId || null, content })
      .select("*, projects(name)")
      .single();
    if (!data) return null;
    const projName = (data.projects as { name: string } | null)?.name ?? "";
    const mapped = mapNote(data, projName);
    setNotes((prev) => [mapped, ...prev]);
    return mapped;
  }, [supabase]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    const row = unmapNote(updates);
    const { error: err } = await supabase.from("notes").update(row).eq("id", id);
    if (err) fetch();
  }, [supabase, fetch]);

  const togglePin = useCallback(async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    const newPinned = !note.pinned;
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: newPinned } : n)));
    await supabase.from("notes").update({ pinned: newPinned }).eq("id", id);
  }, [supabase, notes]);

  const deleteNote = useCallback(async (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    await supabase.from("notes").delete().eq("id", id);
  }, [supabase]);

  return { notes, loading, error, refetch: fetch, createNote, updateNote, togglePin, deleteNote };
}
