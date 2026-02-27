"use client";

import { useState } from "react";
import {
  X, Plus, Calendar, ChevronDown, ChevronRight, Lock, GripVertical,
} from "lucide-react";
import { PROJECTS } from "@/lib/data/projects";
import { WORKERS } from "@/lib/data/workers";
import { TASKS } from "@/lib/data/tasks";
import { ST } from "@/lib/constants/status";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewTaskModalProps {
  onClose: () => void;
}

export function NewTaskModal({ onClose }: NewTaskModalProps) {
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="rounded-xl border border-border-default bg-bg-deep w-full max-w-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <h3 className="text-lg font-semibold text-text-primary">New Task</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5 text-text-secondary">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <Label>Title *</Label>
            <Input placeholder="What needs to be done?" />
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none glass-input text-text-primary placeholder:text-text-muted"
              rows={3}
              placeholder="Detailed description, requirements, context..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Project</Label>
              <Select>
                {PROJECTS.map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select>
                <option>Medium</option>
                <option>Urgent</option>
                <option>High</option>
                <option>Low</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Assign Worker</Label>
              <Select>
                <option>Auto (Orchestrator decides)</option>
                {WORKERS.map((w) => (
                  <option key={w.id}>
                    {w.isHuman ? "\u{1F464}" : "\u{1F916}"} {w.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Review By</Label>
              <Select>
                <option>Orchestrator decides</option>
                <option>Orchestrator review</option>
                <option>Human Review</option>
                {WORKERS.filter((w) => w.isHuman).map((w) => (
                  <option key={w.id}>{w.name}</option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <Input placeholder="backend, auth, urgent (comma separated)" />
          </div>

          {/* Dependencies */}
          <div>
            <Label>Dependencies</Label>
            <div className="rounded-lg p-2 glass-input">
              <input
                placeholder="Search tasks..."
                className="w-full bg-transparent text-sm outline-none mb-2 px-1 text-text-primary placeholder:text-text-muted"
              />
              <div className="max-h-28 overflow-y-auto space-y-1">
                {TASKS.slice(0, 6).map((t) => {
                  const sc = ST[t.s];
                  return (
                    <label key={t.id} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer">
                      <input type="checkbox" className="accent-[#c9a96e]" />
                      <span className="text-xs flex-1 truncate text-text-primary">{t.title}</span>
                      <Badge color={sc.c} bg={sc.bg} small>{sc.l}</Badge>
                    </label>
                  );
                })}
              </div>
            </div>
            <span className="text-[10px] mt-1 block text-text-muted">
              Task won&apos;t start until all selected dependencies are completed
            </span>
          </div>

          {/* Subtasks */}
          <div>
            <Label>Subtasks</Label>
            <div className="space-y-1.5">
              {["Set up project scaffold", "Write unit tests"].map((st, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg glass-input">
                  <GripVertical size={12} className="text-text-muted cursor-grab" />
                  <span className="text-sm flex-1 text-text-primary">{st}</span>
                  <button className="p-0.5 rounded hover:bg-white/5">
                    <X size={12} className="text-text-muted" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  placeholder="Add subtask..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none glass-input text-text-primary placeholder:text-text-muted"
                />
                <button className="px-3 py-2 rounded-lg text-sm flex items-center gap-1 bg-accent text-accent-fg">
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>
            <span className="text-[10px] mt-1 block text-text-muted">
              Subtasks inherit parent&apos;s project and worker unless overridden
            </span>
          </div>

          {/* Scheduling */}
          <div className="border-t border-border-default pt-4">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="flex items-center gap-2 text-sm"
              style={{ color: showSchedule ? "#c9a96e" : "#a1a1aa" }}
            >
              <Calendar size={14} /> Scheduling{" "}
              {showSchedule ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
            {showSchedule && (
              <div className="mt-3 space-y-3 p-3 rounded-lg bg-bg-card">
                <div>
                  <Label>When</Label>
                  <div className="flex gap-2">
                    {["Now", "Scheduled", "Recurring"].map((o) => (
                      <button
                        key={o}
                        className="flex-1 px-3 py-1.5 rounded-lg text-xs border text-center transition-colors"
                        style={{
                          borderColor: o === "Now" ? "#c9a96e" : "rgba(200,169,110,0.1)",
                          color: o === "Now" ? "#c9a96e" : "#a1a1aa",
                          backgroundColor: o === "Now" ? "rgba(201,169,110,0.13)" : "transparent",
                        }}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>Repeat</Label>
                  <Select>
                    <option>No repeat</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Custom (cron)</option>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Lock */}
          <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-bg-card">
            <input type="checkbox" className="accent-[#c9a96e]" />
            <div>
              <span className="text-sm text-text-primary">Lock task</span>
              <p className="text-[10px] text-text-muted">Orchestrator cannot modify this task</p>
            </div>
            <Lock size={14} className="ml-auto text-accent" />
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-border-default">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary>
            <Plus size={14} /> Create Task
          </Button>
        </div>
      </div>
    </div>
  );
}
