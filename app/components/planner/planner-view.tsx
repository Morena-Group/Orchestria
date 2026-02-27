"use client";

import { useState, useRef, useCallback } from "react";
import type { PlanNode, PlanChat } from "@/lib/types";
import { PYRAMID as INITIAL_PYRAMID, PLANS, PLAN_TEMPLATES, PLAN_CHATS } from "@/lib/data/planner";
import { WORKERS } from "@/lib/data/workers";
import { createFilterFn } from "@/lib/utils/planner";
import { PlannerToolbar } from "./planner-toolbar";
import { PlannerFilterBar } from "./planner-filter-bar";
import { PlannerTemplatesStrip } from "./planner-templates-strip";
import { PyramidCanvas } from "./pyramid-canvas";
import { PyramidNode } from "./pyramid-node";
import { DetailPanel } from "./detail-panel";
import { ChatPanel } from "./chat-panel";
import { PanelTabs } from "./panel-tabs";
import { BulkActionBar } from "./bulk-action-bar";
import { Plus } from "lucide-react";

export function PlannerView() {
  // Data state
  const [nodes, setNodes] = useState<PlanNode[]>(INITIAL_PYRAMID);
  const [chatMessages, setChatMessages] = useState<PlanChat[]>(PLAN_CHATS);

  // Selection & navigation
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    r0: true,
    r1: true,
    r2: true,
    r5: true,
  });
  const [activePlan, setActivePlan] = useState("plan1");

  // Panels & dropdowns
  const [showVersions, setShowVersions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Chat
  const [chatInput, setChatInput] = useState("");

  // Canvas
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Multi-select
  const [selectMode, setSelectMode] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  // Filters
  const [filterWorker, setFilterWorker] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAct, setFilterAct] = useState("all");

  // Derived
  const hasFilter = filterWorker !== "all" || filterStatus !== "all" || filterAct !== "all";
  const filterDimmed = createFilterFn(filterWorker, filterStatus, filterAct);
  const selNode = nodes.find((n) => n.id === selected) ?? null;
  const roots = nodes.filter((n) => n.level === 0);

  // Node CRUD handlers
  const handleNodeUpdate = useCallback((nodeId: string, updates: Partial<PlanNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)));
    if (selected === nodeId) {
      setSelected(nodeId); // Re-trigger derived selNode
    }
  }, [selected]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes((prev) => {
      // Remove node and references from parents
      const filtered = prev.filter((n) => n.id !== nodeId);
      return filtered.map((n) => ({
        ...n,
        children: n.children.filter((c) => c !== nodeId),
      }));
    });
    if (selected === nodeId) setSelected(null);
  }, [selected]);

  const handleAddPhase = useCallback(() => {
    const newId = `r${Date.now()}`;
    const newNode: PlanNode = {
      id: newId,
      level: 0,
      label: "New Phase",
      status: "draft",
      priority: "medium",
      worker: null,
      act: null,
      review: "Orchestrator decides",
      tags: [],
      children: [],
      description: "New phase — click to edit",
    };
    setNodes((prev) => [...prev, newNode]);
    setSelected(newId);
    setExpanded((prev) => ({ ...prev, [newId]: true }));
  }, []);

  const handleChatSend = useCallback(() => {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg: PlanChat = { role: "user", content: text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => {
      const botMsg: PlanChat = {
        role: "bot",
        content: "I've noted your request. Let me adjust the plan accordingly.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 1000);
  }, [chatInput]);

  const handleBulkAction = useCallback((action: string, value: string) => {
    if (action === "delete") {
      setNodes((prev) => {
        const filtered = prev.filter((n) => !selectedNodes.includes(n.id));
        return filtered.map((n) => ({
          ...n,
          children: n.children.filter((c) => !selectedNodes.includes(c)),
        }));
      });
      setSelectedNodes([]);
      setSelectMode(false);
    } else {
      console.log("Bulk action:", action, value, "on nodes:", selectedNodes);
    }
  }, [selectedNodes]);

  const toggleExp = useCallback(
    (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] })),
    []
  );

  const onToggleSelect = useCallback(
    (id: string) =>
      setSelectedNodes((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    []
  );

  const handlePanChange = useCallback((x: number, y: number) => {
    setPanX(x);
    setPanY(y);
  }, []);

  const handleZoomChange = useCallback((z: number) => {
    setZoom(Math.min(2, Math.max(0.3, z)));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <PlannerToolbar
        activePlan={activePlan}
        onActivePlanChange={setActivePlan}
        nodeCount={nodes.length}
        showTemplates={showTemplates}
        onToggleTemplates={() => setShowTemplates((p) => !p)}
        showFilter={showFilter}
        onToggleFilter={() => setShowFilter((p) => !p)}
        hasFilter={hasFilter}
        selectMode={selectMode}
        onToggleSelectMode={() => {
          setSelectMode((p) => !p);
          setSelectedNodes([]);
        }}
        zoom={zoom}
        onZoomIn={() => handleZoomChange(zoom + 0.15)}
        onZoomOut={() => handleZoomChange(zoom - 0.15)}
        showVersions={showVersions}
        onToggleVersions={() => setShowVersions((p) => !p)}
        showChat={showChat}
        onToggleChat={() => setShowChat((p) => !p)}
      />

      {/* Conditional bars */}
      {showFilter && (
        <PlannerFilterBar
          filterWorker={filterWorker}
          onFilterWorkerChange={setFilterWorker}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterAct={filterAct}
          onFilterActChange={setFilterAct}
          onClear={() => {
            setFilterWorker("all");
            setFilterStatus("all");
            setFilterAct("all");
          }}
          hasFilter={hasFilter}
        />
      )}

      {showTemplates && <PlannerTemplatesStrip />}

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas */}
        <PyramidCanvas
          panX={panX}
          panY={panY}
          zoom={zoom}
          onPanChange={handlePanChange}
          onZoomChange={handleZoomChange}
          onResetView={handleResetView}
        >
          {roots.map((root) => (
            <PyramidNode
              key={root.id}
              node={root}
              allNodes={nodes}
              selected={selected}
              onSelect={setSelected}
              expanded={expanded}
              onExpand={toggleExp}
              selectMode={selectMode}
              selectedNodes={selectedNodes}
              onToggleSelect={onToggleSelect}
              filterDimmed={filterDimmed}
            />
          ))}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAddPhase}
              className="px-4 py-2 rounded-xl border border-dashed flex items-center gap-2 transition-colors hover:border-accent"
              style={{
                borderColor: "var(--color-border-default)",
                color: "var(--color-text-muted)",
                backgroundColor: "var(--color-bg-card)",
              }}
            >
              <Plus size={14} /> Add Phase
            </button>
          </div>
        </PyramidCanvas>

        {/* Bulk action bar */}
        {selectMode && selectedNodes.length > 0 && (
          <BulkActionBar
            selectedCount={selectedNodes.length}
            onClose={() => {
              setSelectMode(false);
              setSelectedNodes([]);
            }}
            onBulkAction={handleBulkAction}
          />
        )}

        {/* Right panel */}
        {(selNode || showChat) && (
          <div
            className="w-80 border-l flex flex-col overflow-hidden flex-shrink-0"
            style={{
              borderColor: "var(--color-border-default)",
              backgroundColor: "var(--color-bg-deep)",
            }}
          >
            {selNode && showChat && (
              <PanelTabs
                activeTab={showChat ? "chat" : "details"}
                onTabChange={(tab) => setShowChat(tab === "chat")}
              />
            )}

            {selNode && !showChat && (
              <DetailPanel
                node={selNode}
                allNodes={nodes}
                onSelectNode={setSelected}
                onClose={() => setSelected(null)}
                onSave={(nodeId, updates) => handleNodeUpdate(nodeId, updates)}
                onDelete={(nodeId) => handleNodeDelete(nodeId)}
              />
            )}

            {showChat && (
              <ChatPanel
                messages={chatMessages}
                chatInput={chatInput}
                onChatInputChange={setChatInput}
                onSend={handleChatSend}
                contextLabel={selNode?.label ?? null}
                showCloseButton={!selNode}
                onClose={() => setShowChat(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
