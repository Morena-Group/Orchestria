"use client";

import { useState, useRef, useCallback } from "react";
import { PYRAMID, PLANS, PLAN_TEMPLATES, PLAN_CHATS } from "@/lib/data/planner";
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
  const selNode = PYRAMID.find((n) => n.id === selected) ?? null;
  const roots = PYRAMID.filter((n) => n.level === 0);

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
        nodeCount={PYRAMID.length}
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
              allNodes={PYRAMID}
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
                allNodes={PYRAMID}
                onSelectNode={setSelected}
                onClose={() => setSelected(null)}
              />
            )}

            {showChat && (
              <ChatPanel
                chatInput={chatInput}
                onChatInputChange={setChatInput}
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
