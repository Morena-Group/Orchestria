"use client";

import { useState } from "react";
import {
  X, Lock, CheckCircle2, AlertTriangle, Send,
  Code, File, RefreshCw, MessageSquare, Eye,
  Upload, Download, Archive, Trash2, Play, Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getActionIcon } from "@/lib/constants/icons";
import { TASK_ACTIONS } from "./task-actions-config";
import type { Task } from "@/lib/types";
import { ST, PRI } from "@/lib/constants/status";
import { WORKERS } from "@/lib/data/workers";
import { PROJECTS } from "@/lib/data/projects";
import {
  TASK_SUBTASKS, TASK_DESCRIPTIONS, TASK_TIMELINE,
  TASK_ARTIFACTS, TASK_COMMENTS,
} from "@/lib/data/tasks";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

const TIMELINE_ICONS: Record<string, LucideIcon> = {
  step: Play, tool: Code, decision: Check, output: File,
  status: RefreshCw, comment: MessageSquare,
};

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  const worker = WORKERS.find((w) => w.id === task.w);
  const sc = ST[task.s];
  const [tab, setTab] = useState("overview");
  const [commentInput, setCommentInput] = useState("");
  const desc = TASK_DESCRIPTIONS[task.id] || "No description provided.";

  const tabs = [
    { id: "overview", l: "Overview" },
    { id: "activity", l: "Activity" },
    { id: "files", l: "Files" },
    { id: "settings", l: "Settings" },
  ];

  const headerContent = (
    <div className="p-4 border-b border-border-default flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge color={sc.c} bg={sc.bg}>{sc.l}</Badge>
          {task.lock && <Lock size={14} className="text-accent" />}
          {PRI[task.p] && (
            <span className="text-xs" style={{ color: PRI[task.p].c }}>{PRI[task.p].l}</span>
          )}
          {task.tags.map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-accent-dim text-accent-hover">
              {t}
            </span>
          ))}
        </div>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-white/5 text-text-secondary">
          <X size={16} />
        </button>
      </div>
      <h2 className="text-lg font-semibold mb-1 text-text-primary">{task.title}</h2>
      <div className="flex items-center gap-4">
        {worker && (
          <div className="flex items-center gap-2">
            <Avatar type={worker.type} size={20} role={worker.role} />
            <span className="text-xs text-text-secondary">
              {worker.name}{worker.isHuman ? " (Human)" : ""}
            </span>
          </div>
        )}
        <span className="text-[10px] text-text-muted">Created 2 days ago</span>
        {task.sub > 0 && (
          <span className="text-xs flex items-center gap-1 text-text-secondary">
            <CheckCircle2 size={12} /> {task.subD}/{task.sub} subtasks
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Modal open={true} onClose={onClose} header={headerContent} maxWidth="max-w-4xl">

        {/* Blocked banner */}
        {task.block && (
          <div className="px-4 py-3 border-b border-border-default flex items-start gap-3 flex-shrink-0 bg-accent-dim/60">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-accent" />
            <div className="flex-1">
              <p className="text-xs font-medium text-accent">Agent Blocked — Input Required</p>
              <p className="text-xs mt-0.5 text-text-secondary">{task.block}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                placeholder="Provide input..."
                className="px-3 py-1.5 rounded-lg text-xs outline-none w-48 glass-input text-text-primary placeholder:text-text-muted"
              />
              <button className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 bg-accent text-accent-fg">
                <Send size={12} /> Resume
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-border-default flex-shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2.5 text-xs font-medium transition-colors"
              style={{
                color: tab === t.id ? "#c9a96e" : "#a1a1aa",
                borderBottom: tab === t.id ? "2px solid #c9a96e" : "2px solid transparent",
              }}
            >
              {t.l}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div className="flex">
              <div className="flex-1 p-5 border-r border-border-default">
                {/* Description */}
                <div className="mb-5">
                  <span className="text-[10px] uppercase tracking-wider block mb-1.5 text-text-muted">
                    Description
                  </span>
                  <p className="text-sm leading-relaxed text-text-primary">{desc}</p>
                </div>

                {/* Subtasks */}
                {task.sub > 0 && (
                  <div className="mb-5">
                    <span className="text-[10px] uppercase tracking-wider block mb-1.5 text-text-muted">
                      Subtasks ({task.subD}/{task.sub})
                    </span>
                    <div className="h-1.5 rounded-full overflow-hidden mb-2 bg-white/5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          background: "linear-gradient(90deg, #c9a96e, #d4b87e)",
                          boxShadow: "0 0 8px rgba(201,169,110,0.3)",
                          width: `${Math.round((task.subD / task.sub) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      {Array.from({ length: task.sub }, (_, i) => {
                        const done = i < task.subD;
                        const subNames = TASK_SUBTASKS[task.id];
                        const name = subNames?.[i] || `Subtask ${i + 1}`;
                        return (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-glass">
                            {done ? (
                              <CheckCircle2 size={14} className="text-accent" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border border-text-muted" />
                            )}
                            <span
                              className="text-xs flex-1"
                              style={{
                                color: done ? "#71717a" : "#ededef",
                                textDecoration: done ? "line-through" : "none",
                              }}
                            >
                              {name}
                            </span>
                            {done && <span className="text-[9px] text-text-muted">Completed</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dependencies */}
                <div className="mb-5">
                  <span className="text-[10px] uppercase tracking-wider block mb-1.5 text-text-muted">
                    Dependencies
                  </span>
                  {task.id === "t4" ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-glass">
                      <span className="text-xs text-text-primary">
                        Design database schema for user auth
                      </span>
                      <Badge color="#a1a1aa" bg="#1c1f2e" small>Completed</Badge>
                    </div>
                  ) : (
                    <span className="text-xs text-text-muted">No dependencies</span>
                  )}
                </div>

                {/* Comments */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider block mb-2 text-text-muted">
                    Comments ({TASK_COMMENTS.length})
                  </span>
                  <div className="space-y-3 mb-3">
                    {TASK_COMMENTS.map((c) => (
                      <div key={c.id} className="flex gap-2.5">
                        {c.isHuman ? (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 bg-bg-elevated text-text-secondary">
                            M
                          </div>
                        ) : (
                          <Avatar type={(c.type as "claude-cli") || "claude-cli"} size={28} role="worker" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-medium text-text-primary">{c.author}</span>
                            <span className="text-[10px] text-text-muted">{c.time}</span>
                          </div>
                          <p className="text-xs leading-relaxed text-text-secondary">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 rounded-lg text-xs outline-none glass-input text-text-primary placeholder:text-text-muted"
                    />
                    <button className="px-3 py-2 rounded-lg text-xs bg-accent text-accent-fg">
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right sidebar metadata */}
              <div className="w-56 p-4 flex-shrink-0 space-y-3">
                <div>
                  <Label>Status</Label>
                  <Select defaultValue={task.s}>
                    {Object.entries(ST).map(([k, v]) => (
                      <option key={k} value={k}>{v.l}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select defaultValue={task.p}>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </div>
                <div>
                  <Label>Worker</Label>
                  <Select defaultValue={task.w || "auto"}>
                    <option value="auto">Auto</option>
                    {WORKERS.map((wr) => (
                      <option key={wr.id} value={wr.id}>{wr.name}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Review By</Label>
                  <Select>
                    <option>Orchestrator decides</option>
                    <option>Orchestrator review</option>
                    <option>Human Review</option>
                    {WORKERS.filter((wr) => wr.isHuman).map((wr) => (
                      <option key={wr.id}>{wr.name}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label>Project</Label>
                  <Select defaultValue={task.pr}>
                    {PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="border-t border-border-default pt-3">
                  <Label>Files ({TASK_ARTIFACTS.length})</Label>
                  {TASK_ARTIFACTS.slice(0, 2).map((f) => (
                    <div key={f.name} className="flex items-center gap-2 py-1">
                      <File size={12} className="text-accent" />
                      <span className="text-[10px] truncate flex-1 text-text-primary">{f.name}</span>
                      <span className="text-[9px] text-text-muted">{f.size}</span>
                    </div>
                  ))}
                  {TASK_ARTIFACTS.length > 2 && (
                    <button className="text-[10px] mt-1 text-accent-hover">
                      +{TASK_ARTIFACTS.length - 2} more
                    </button>
                  )}
                </div>
                <div className="border-t border-border-default pt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked={task.lock} className="accent-[#c9a96e]" />
                    <span className="text-xs text-text-primary">Lock task</span>
                    <Lock size={12} className="ml-auto text-accent" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY TAB */}
          {tab === "activity" && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-wider text-text-muted">
                  Execution Timeline
                </span>
                <div className="flex gap-1">
                  {["All", "Steps", "Decisions", "Tools"].map((f) => (
                    <button
                      key={f}
                      className="px-2 py-1 rounded text-[10px]"
                      style={{
                        backgroundColor: f === "All" ? "rgba(201,169,110,0.13)" : "transparent",
                        color: f === "All" ? "#d4b87e" : "#71717a",
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border-default" />
                <div className="space-y-0">
                  {TASK_TIMELINE.map((ev, i) => {
                    const Ic = TIMELINE_ICONS[ev.type] || Play;
                    const color = ev.type === "status" ? "#a1a1aa" : "#c9a96e";
                    return (
                      <div key={i} className="flex gap-3 py-2 relative">
                        <div
                          className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 z-10 bg-bg-deep"
                          style={{ border: `2px solid ${color}` }}
                        >
                          <Ic size={12} style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-text-primary">{ev.actor}</span>
                            <span className="text-[10px] text-text-muted">{ev.time}</span>
                            <Badge color={color} small>{ev.type}</Badge>
                          </div>
                          <p className="text-xs mt-0.5 text-text-secondary">{ev.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {task.s !== "completed" && (
                <div className="mt-4 p-3 rounded-lg text-center bg-glass">
                  <span className="text-xs text-text-muted">
                    Task is still {sc.l.toLowerCase()} — new activity will appear here in real-time
                  </span>
                </div>
              )}
            </div>
          )}

          {/* FILES TAB */}
          {tab === "files" && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-wider text-text-muted">
                  Artifacts & Files ({TASK_ARTIFACTS.length})
                </span>
                <Button><Upload size={12} /> Upload</Button>
              </div>
              <div className="space-y-2">
                {TASK_ARTIFACTS.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center gap-3 p-3 rounded-lg glass-input hover:border-[rgba(200,169,110,0.15)] transition-all duration-150"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-bg-elevated">
                      {f.type === "code" ? (
                        <Code size={18} className="text-text-secondary" />
                      ) : f.type === "image" ? (
                        <Eye size={18} className="text-text-secondary" />
                      ) : (
                        <File size={18} className="text-text-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm block truncate text-text-primary">{f.name}</span>
                      <span className="text-[10px] text-text-muted">{f.size} &bull; {f.date}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-white/5">
                        <Eye size={14} className="text-text-secondary" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-white/5">
                        <Download size={14} className="text-text-secondary" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 p-3 rounded-xl border border-dashed border-border-default flex items-center justify-center gap-2 text-text-muted hover:border-accent transition-colors">
                <Upload size={14} /> Drop files here or click to upload
              </button>
            </div>
          )}

          {/* SETTINGS TAB */}
          {tab === "settings" && (
            <div className="p-5 max-w-lg space-y-4">
              <div>
                <Label>Task Title</Label>
                <Input defaultValue={task.title} />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none glass-input text-text-primary"
                  rows={4}
                  defaultValue={desc}
                />
              </div>
              <div>
                <Label>Tags</Label>
                <Input defaultValue={task.tags.join(", ")} />
              </div>
              <div>
                <Label>Scheduling</Label>
                <div className="flex gap-2">
                  {["Now", "Scheduled", "Recurring"].map((o) => (
                    <button
                      key={o}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs border text-center"
                      style={{
                        borderColor: o === "Now" ? "#c9a96e" : "rgba(200,169,110,0.1)",
                        color: o === "Now" ? "#c9a96e" : "#a1a1aa",
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-border-default pt-4">
                <h4 className="text-xs font-semibold mb-2 text-error">Danger Zone</h4>
                <div className="flex gap-2">
                  <Button><Archive size={12} /> Archive</Button>
                  <button className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-border-default text-error hover:bg-error-muted transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between p-4 border-t border-border-default flex-shrink-0">
          <div className="flex items-center gap-2">
            {(TASK_ACTIONS[task.s] ?? [])
              .filter((a) => a.variant !== "danger")
              .map((action) => {
                const Icon = getActionIcon(action.icon);
                return (
                  <Button
                    key={action.id}
                    primary={action.variant === "primary"}
                    onClick={() => console.log("Task modal action:", action.id, task.id)}
                  >
                    <Icon size={14} /> {action.label}
                  </Button>
                );
              })}
          </div>
          <span className="text-[10px] text-text-muted">
            ID: {task.id} &bull; Last updated 2h ago
          </span>
        </div>
    </Modal>
  );
}
