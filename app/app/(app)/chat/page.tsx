"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, Send, Paperclip, Database, FileText, X, MessageSquare,
} from "lucide-react";
import { useChats, usePlugins } from "@/lib/hooks";
import { Avatar } from "@/components/ui/avatar";

const CHAT_LIST = [
  { id: "p", l: "AI SaaS Platform", s: "Break down auth...", t: "10m" },
  { id: "g", l: "Global Overview", s: "Cross-project report", t: "2h" },
];

const CONTEXT_FILES = ["memory.md", "project-overview.md", "db-schema.md"];

const BOT_REPLIES = [
  "I'll look into that. Let me analyze the relevant context and get back to you with a plan.",
  "Great question! Based on the current project state, I'd recommend breaking this into smaller tasks first.",
  "Done! I've processed your request. Would you like me to create tasks from this?",
  "I can see a few options here. Let me outline the trade-offs for each approach.",
  "Understood. I'll coordinate with the available workers and update you on progress.",
];

export default function ChatPage() {
  const { messages, sendMessage, clearMessages, setMessages } = useChats();
  const { plugins } = usePlugins();
  const [input, setInput] = useState("");
  const [showCtx, setShowCtx] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    sendMessage(text, "user");
    setInput("");

    // Mock bot reply after 1s
    setTimeout(() => {
      sendMessage(
        BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)],
        "bot"
      );
    }, 1000);
  }

  function handleNewChat() {
    clearMessages();
    setInput("");
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Chat list sidebar */}
      <div className="w-56 border-r border-border-default flex flex-col bg-bg-surface">
        <div className="p-3 border-b border-border-default">
          <button
            onClick={handleNewChat}
            className="w-full px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 bg-accent text-accent-fg"
          >
            <Plus size={14} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {CHAT_LIST.map((c) => (
            <button
              key={c.id}
              className="w-full text-left p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: c.id === "p" ? "rgba(255,255,255,0.05)" : "transparent",
              }}
            >
              <span className="text-sm block truncate text-text-primary">{c.l}</span>
              <span className="text-xs truncate block text-text-muted">{c.s}</span>
            </button>
          ))}
          <div className="px-2 pt-2">
            <p className="text-[10px] leading-relaxed text-text-muted">
              Each project gets its own chat context. Start typing to begin.
            </p>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar type="claude-cli" size={28} role="orchestrator" />
            <span className="text-sm font-medium text-text-primary">Claude Opus</span>
          </div>
          <button
            onClick={() => setShowCtx(!showCtx)}
            className="px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1 transition-colors"
            style={{
              borderColor: showCtx ? "#c9a96e" : "var(--color-border-default)",
              color: showCtx ? "#c9a96e" : "#a1a1aa",
            }}
          >
            <Database size={12} /> Context
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Messages */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center h-full">
                  <div className="text-center max-w-xs">
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-accent-dim"
                    >
                      <MessageSquare size={24} className="text-accent" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1 text-text-primary">
                      Start a conversation
                    </h3>
                    <p className="text-xs leading-relaxed text-text-secondary">
                      Ask the orchestrator to break down features, assign tasks, generate reports, or
                      query your connected plugins.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}
                    >
                      {m.role !== "user" && (
                        <Avatar type="claude-cli" size={28} role="orchestrator" />
                      )}
                      <div className="max-w-[70%]">
                        <div
                          className="p-3 rounded-xl text-sm"
                          style={{
                            backgroundColor:
                              m.role === "user"
                                ? "rgba(201,169,110,0.13)"
                                : "var(--color-bg-card)",
                            color: "var(--color-text-primary)",
                          }}
                        >
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-border-default">
              <div className="rounded-xl border p-2 glass-input">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask the orchestrator..."
                  className="w-full bg-transparent text-sm outline-none resize-none text-text-primary placeholder:text-text-muted"
                  style={{ minHeight: 40 }}
                  rows={1}
                />
                <div className="flex items-center justify-between mt-1">
                  <button className="p-1 rounded hover:bg-white/5 text-text-muted">
                    <Paperclip size={14} />
                  </button>
                  <button
                    onClick={handleSend}
                    className="p-1.5 rounded-lg bg-accent text-accent-fg"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Context panel */}
          {showCtx && (
            <div className="w-60 border-l border-border-default p-4 overflow-y-auto bg-bg-surface">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-text-muted">
                Active Context
              </h4>
              <div className="space-y-2">
                {CONTEXT_FILES.map((f) => (
                  <div key={f} className="flex items-center gap-2 p-2 rounded bg-bg-card">
                    <FileText size={12} className="text-accent" />
                    <span className="text-xs flex-1 text-text-primary">{f}</span>
                    <button className="p-0.5 rounded hover:bg-white/5">
                      <X size={10} className="text-text-muted" />
                    </button>
                  </div>
                ))}
                <button className="w-full p-2 rounded border border-dashed border-border-default text-xs flex items-center justify-center gap-1 text-text-muted">
                  <Plus size={10} /> Add
                </button>
              </div>

              <h4 className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2 text-text-muted">
                Data Sources
              </h4>
              <div className="space-y-2">
                {plugins.map((plg) => (
                  <div key={plg.id} className="flex items-center gap-2 p-2 rounded bg-bg-card">
                    <span className="text-sm">{plg.icon}</span>
                    <span className="text-xs flex-1 text-text-primary">{plg.name}</span>
                    <span className="text-[9px] text-accent">live</span>
                  </div>
                ))}
                <p className="text-[9px] text-text-muted">
                  The orchestrator can query connected plugins when answering.
                </p>
              </div>

              <h4 className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2 text-text-muted">
                Tokens
              </h4>
              <div className="p-2 rounded bg-bg-card">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">Used</span>
                  <span className="text-text-primary">42K / 128K</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-bg-base">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: "33%" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
