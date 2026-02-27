"use client";

interface PanelTabsProps {
  activeTab: "details" | "chat";
  onTabChange: (tab: "details" | "chat") => void;
}

export function PanelTabs({ activeTab, onTabChange }: PanelTabsProps) {
  return (
    <div
      className="flex border-b flex-shrink-0"
      style={{ borderColor: "var(--color-border-default)" }}
    >
      <button
        onClick={() => onTabChange("details")}
        className="flex-1 px-3 py-2 text-xs text-center transition-colors"
        style={{
          color:
            activeTab === "details"
              ? "var(--color-accent)"
              : "var(--color-text-secondary)",
          backgroundColor:
            activeTab === "details"
              ? "rgba(201, 169, 110, 0.06)"
              : "transparent",
        }}
      >
        Details
      </button>
      <button
        onClick={() => onTabChange("chat")}
        className="flex-1 px-3 py-2 text-xs text-center transition-colors"
        style={{
          color:
            activeTab === "chat"
              ? "var(--color-accent)"
              : "var(--color-text-secondary)",
          backgroundColor:
            activeTab === "chat"
              ? "rgba(201, 169, 110, 0.06)"
              : "transparent",
        }}
      >
        Chat
      </button>
    </div>
  );
}
