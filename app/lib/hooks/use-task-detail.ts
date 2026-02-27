"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { TaskTimelineEvent, TaskArtifact, TaskComment } from "@/lib/types";

interface TaskDetail {
  description: string;
  subtasks: { id: string; label: string; done: boolean }[];
  comments: TaskComment[];
  timeline: TaskTimelineEvent[];
  artifacts: TaskArtifact[];
}

export function useTaskDetail(taskId: string | null) {
  const [detail, setDetail] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetch = useCallback(async () => {
    if (!taskId) { setDetail(null); return; }
    setLoading(true);

    const [descRes, subsRes, commRes, tlRes, artRes] = await Promise.all([
      supabase.from("task_details").select("description").eq("task_id", taskId).maybeSingle(),
      supabase.from("task_subtasks").select("*").eq("task_id", taskId).order("sort_order"),
      supabase.from("task_comments").select("*").eq("task_id", taskId).order("created_at"),
      supabase.from("task_timeline").select("*").eq("task_id", taskId).order("created_at"),
      supabase.from("task_artifacts").select("*").eq("task_id", taskId).order("created_at"),
    ]);

    if (descRes.error || subsRes.error || commRes.error || tlRes.error || artRes.error) {
      setError("Failed to load task details");
      setLoading(false);
      return;
    }

    setDetail({
      description: descRes.data?.description ?? "",
      subtasks: (subsRes.data ?? []).map((s) => ({ id: s.id, label: s.label, done: s.done })),
      comments: (commRes.data ?? []).map((c) => ({
        id: c.id,
        author: c.author,
        isHuman: c.is_human,
        type: c.author_type ?? undefined,
        time: new Date(c.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        text: c.content,
      })),
      timeline: (tlRes.data ?? []).map((t) => ({
        time: new Date(t.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
        actor: t.actor,
        type: t.event_type,
        text: t.content,
      })),
      artifacts: (artRes.data ?? []).map((a) => ({
        name: a.name,
        size: a.size,
        type: a.type,
        date: new Date(a.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      })),
    });
    setLoading(false);
  }, [supabase, taskId]);

  useEffect(() => { fetch(); }, [fetch]);

  const toggleSubtask = useCallback(async (subtaskId: string) => {
    if (!detail) return;
    const sub = detail.subtasks.find((s) => s.id === subtaskId);
    if (!sub) return;
    setDetail((prev) => prev ? {
      ...prev,
      subtasks: prev.subtasks.map((s) => s.id === subtaskId ? { ...s, done: !s.done } : s),
    } : null);
    await supabase.from("task_subtasks").update({ done: !sub.done }).eq("id", subtaskId);
  }, [supabase, detail]);

  const addComment = useCallback(async (text: string, author: string, isHuman: boolean) => {
    if (!taskId) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data } = await supabase
      .from("task_comments")
      .insert({ user_id: u.user.id, task_id: taskId, author, is_human: isHuman, content: text })
      .select()
      .single();
    if (data) {
      setDetail((prev) => prev ? {
        ...prev,
        comments: [...prev.comments, {
          id: data.id,
          author: data.author,
          isHuman: data.is_human,
          time: "Just now",
          text: data.content,
        }],
      } : null);
    }
  }, [supabase, taskId]);

  const updateDescription = useCallback(async (text: string) => {
    if (!taskId) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setDetail((prev) => prev ? { ...prev, description: text } : null);
    await supabase.from("task_details")
      .upsert({ task_id: taskId, user_id: u.user.id, description: text }, { onConflict: "task_id" });
  }, [supabase, taskId]);

  return { detail, loading, error, refetch: fetch, toggleSubtask, addComment, updateDescription };
}
