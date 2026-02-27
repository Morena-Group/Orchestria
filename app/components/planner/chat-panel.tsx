"use client";

import type { PlanChat } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { X, Target, Send } from "lucide-react";

interface ChatPanelProps {
  messages: PlanChat[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSend: () => void;
  contextLabel: string | null;
  showCloseButton: boolean;
  onClose: () => void;
}

export function ChatPanel({
  messages,
  chatInput,
  onChatInputChange,
  onSend,
  contextLabel,
  showCloseButton,
  onClose,
}: ChatPanelProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="p-3 border-b flex items-center justify-between flex-shrink-0"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <div className="flex items-center gap-2">
          <Avatar type="claude-cli" size={22} role="orchestrator" />
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Plan Chat
          </span>
        </div>
        {showCloseButton && (
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5">
            <X size={14} style={{ color: "var(--color-text-secondary)" }} />
          </button>
        )}
      </div>

      {/* Context indicator */}
      {contextLabel && (
        <div
          className="px-3 py-1.5 border-b flex items-center gap-2 flex-shrink-0"
          style={{
            borderColor: "var(--color-border-default)",
            backgroundColor: "rgba(201, 169, 110, 0.05)",
          }}
        >
          <Target size={10} style={{ color: "var(--color-accent)" }} />
          <span
            className="text-[10px]"
            style={{ color: "var(--color-accent-hover)" }}
          >
            Context: {contextLabel}
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            } gap-1.5`}
          >
            {m.role !== "user" && (
              <Avatar type="claude-cli" size={20} role="orchestrator" />
            )}
            <div
              className="max-w-[85%] p-2.5 rounded-xl text-xs"
              style={{
                backgroundColor:
                  m.role === "user"
                    ? "var(--color-accent-muted)"
                    : "var(--color-bg-card)",
                color: "var(--color-text-primary)",
              }}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              <span
                className="text-[9px] block mt-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                {m.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        className="p-3 border-t flex-shrink-0"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <div className="flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => onChatInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={
              contextLabel
                ? `Ask about "${contextLabel}"...`
                : "Ask about this plan..."
            }
            className="glass-input flex-1 px-3 py-2 rounded-lg text-xs outline-none"
          />
          <button
            onClick={onSend}
            className="p-2 rounded-lg"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-fg)",
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
