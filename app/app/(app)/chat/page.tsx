"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, Send, Paperclip, Database, FileText, X, MessageSquare,
} from "lucide-react";
import { useChats, usePlugins, useProjects } from "@/lib/hooks";
import { Avatar } from "@/components/ui/avatar";

export default function ChatPage() {
  const { messages, sendMessage, clearMessages } = useChats();
  const { plugins } = usePlugins();
  const { projects } = useProjects();
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

    // Placeholder — will be replaced with real AI integration
    setTimeout(() => {
      sendMessage(
        "AI chat integration is not yet configured. Connect an AI worker in Settings to enable orchestrator responses.",
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
          {projects.length > 0 ? (
            projects.map((p) => (
              <button
                key={p.id}
                className="w-full text-left p-2 rounded-lg transition-colors hover:bg-white/[0.05]"
              >
                <span className="text-sm block truncate text-text-primary">{p.name}</span>
                <span className="text-xs truncate block text-text-muted">Project chat</span>
              </button>
            ))
          ) : (
            <div className="px-2 pt-2">
              <p className="text-[10px] leading-relaxed text-text-muted">
                No projects yet. Create a project to start a project-scoped chat.
              </p>
            </div>
          )}
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
            <span className="text-sm font-medium text-text-primary">Orchestrator</span>
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
                <p className="text-[10px] text-text-muted">
                  No context files loaded yet. Context will be populated when the orchestrator processes tasks.
                </p>
                <button className="w-full p-2 rounded border border-dashed border-border-default text-xs flex items-center justify-center gap-1 text-text-muted">
                  <Plus size={10} /> Add
                </button>
              </div>

              <h4 className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2 text-text-muted">
                Data Sources
              </h4>
              <div className="space-y-2">
                {plugins.length > 0 ? (
                  plugins.map((plg) => (
                    <div key={plg.id} className="flex items-center gap-2 p-2 rounded bg-bg-card">
                      <span className="text-sm">{plg.icon}</span>
                      <span className="text-xs flex-1 text-text-primary">{plg.name}</span>
                      <span className="text-[9px] text-accent">live</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-text-muted">
                    No plugins connected. Add plugins in Settings.
                  </p>
                )}
              </div>

              <h4 className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2 text-text-muted">
                Tokens
              </h4>
              <div className="p-2 rounded bg-bg-card">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">Used</span>
                  <span className="text-text-primary">0 / 8K</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-bg-base">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: "0%" }}
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
