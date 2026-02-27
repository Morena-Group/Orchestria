"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { mapPlan, mapPlanNode, mapPlanChat, unmapPlanNode } from "@/lib/db/mappers";
import type { Plan, PlanNode, PlanChat } from "@/lib/types";

export function usePlanner(planId: string | null) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [nodes, setNodes] = useState<PlanNode[]>([]);
  const [chatMessages, setChatMessages] = useState<PlanChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchPlans = useCallback(async () => {
    const { data } = await supabase.from("plans").select("*").order("created_at", { ascending: false });
    setPlans((data ?? []).map(mapPlan));
  }, [supabase]);

  const fetchNodes = useCallback(async () => {
    if (!planId) { setNodes([]); return; }
    const { data, error: err } = await supabase
      .from("planner_nodes")
      .select("*")
      .eq("plan_id", planId)
      .order("sort_order");
    if (err) { setError(err.message); return; }
    setNodes((data ?? []).map(mapPlanNode));
  }, [supabase, planId]);

  const fetchChat = useCallback(async () => {
    if (!planId) { setChatMessages([]); return; }
    const { data } = await supabase
      .from("plan_chats")
      .select("*")
      .eq("plan_id", planId)
      .order("created_at");
    setChatMessages((data ?? []).map(mapPlanChat));
  }, [supabase, planId]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPlans(), fetchNodes(), fetchChat()]);
    setLoading(false);
  }, [fetchPlans, fetchNodes, fetchChat]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateNode = useCallback(async (id: string, updates: Partial<PlanNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    const { error: err } = await supabase
      .from("planner_nodes")
      .update(unmapPlanNode(updates))
      .eq("id", id);
    if (err) fetchNodes();
  }, [supabase, fetchNodes]);

  const deleteNode = useCallback(async (id: string) => {
    setNodes((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      return filtered.map((n) => ({ ...n, children: n.children.filter((c) => c !== id) }));
    });
    const { error: err } = await supabase.from("planner_nodes").delete().eq("id", id);
    if (err) fetchNodes();
  }, [supabase, fetchNodes]);

  const addNode = useCallback(async (node: Omit<PlanNode, "id">, parentId?: string) => {
    if (!planId) return null;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const id = `r${Date.now()}`;
    const row = unmapPlanNode(node);
    const { data, error: err } = await supabase
      .from("planner_nodes")
      .insert({ id, user_id: u.user.id, plan_id: planId, ...row })
      .select()
      .single();
    if (err || !data) return null;
    const mapped = mapPlanNode(data);
    setNodes((prev) => {
      const updated = [...prev, mapped];
      if (parentId) {
        return updated.map((n) =>
          n.id === parentId ? { ...n, children: [...n.children, id] } : n
        );
      }
      return updated;
    });
    if (parentId) {
      await supabase
        .from("planner_nodes")
        .update({ children: [...(nodes.find((n) => n.id === parentId)?.children ?? []), id] })
        .eq("id", parentId);
    }
    return mapped;
  }, [supabase, planId, nodes]);

  const sendChat = useCallback(async (content: string, role: "user" | "bot" = "user") => {
    if (!planId) return;
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data } = await supabase
      .from("plan_chats")
      .insert({ user_id: u.user.id, plan_id: planId, role, content })
      .select()
      .single();
    if (data) {
      setChatMessages((prev) => [...prev, mapPlanChat(data)]);
    }
  }, [supabase, planId]);

  return {
    plans, nodes, chatMessages, loading, error,
    refetch: fetchAll, fetchPlans,
    updateNode, deleteNode, addNode, sendChat,
    setNodes, setChatMessages,
  };
}
