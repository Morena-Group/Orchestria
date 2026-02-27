"use client";

import { useState } from "react";
import {
  Plus, Calendar, ChevronDown, ChevronRight, Lock, GripVertical, X,
} from "lucide-react";
import { useProjects, useWorkers, useTasks } from "@/lib/hooks";
import { ST } from "@/lib/constants/status";
import type { Priority } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewTaskModal({ open, onClose }: NewTaskModalProps) {
  const { projects } = useProjects();
  const { workers } = useWorkers();
  const { tasks } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState(projects[0]?.id ?? "");
  const [priority, setPriority] = useState<Priority>("medium");
  const [worker, setWorker] = useState("auto");
  const [reviewBy, setReviewBy] = useState("orchestrator");
  const [tagsInput, setTagsInput] = useState("");
  const [dependencies, setDependencies] = useState<string[]>([]);
  const [depSearch, setDepSearch] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduling, setScheduling] = useState<"Now" | "Scheduled" | "Recurring">("Now");
  const [startDate, setStartDate] = useState("");
  const [repeat, setRepeat] = useState("none");
  const [lockTask, setLockTask] = useState(false);

  const filteredDeps = tasks.filter((t) => {
    if (!depSearch) return true;
    return t.title.toLowerCase().includes(depSearch.toLowerCase());
  }).slice(0, 6);

  function addSubtask() {
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    setSubtasks((prev) => [...prev, trimmed]);
    setNewSubtask("");
  }

  function removeSubtask(index: number) {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleDep(taskId: string) {
    setDependencies((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  }

  const { createTask } = useTasks();

  async function handleSubmit() {
    if (!title.trim()) return;
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    await createTask({
      title: title.trim(),
      s: "pending",
      p: priority,
      pr: project || projects[0]?.id || "",
      w: worker === "auto" ? null : worker,
      tags,
      lock: lockTask,
      sub: subtasks.length,
      subD: 0,
    });
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setWorker("auto");
    setTagsInput("");
    setSubtasks([]);
    setLockTask(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New Task" maxWidth="max-w-xl">
      <div className="p-4 space-y-4 overflow-y-auto max-h-[65vh]">
        <div>
          <Label>Title *</Label>
          <Input placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label>Description</Label>
          <textarea
            className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none glass-input text-text-primary placeholder:text-text-muted"
            rows={3}
            placeholder="Detailed description, requirements, context..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Project</Label>
            <Select value={project} onChange={(e) => setProject(e.target.value)}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
              <option value="medium">Medium</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Assign Worker</Label>
            <Select value={worker} onChange={(e) => setWorker(e.target.value)}>
              <option value="auto">Auto (Orchestrator decides)</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.isHuman ? "\u{1F464}" : "\u{1F916}"} {w.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Review By</Label>
            <Select value={reviewBy} onChange={(e) => setReviewBy(e.target.value)}>
              <option value="orchestrator">Orchestrator decides</option>
              <option value="orchestrator-review">Orchestrator review</option>
              <option value="human">Human Review</option>
              {workers.filter((w) => w.isHuman).map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label>Tags</Label>
          <Input
            placeholder="backend, auth, urgent (comma separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        {/* Dependencies */}
        <div>
          <Label>Dependencies</Label>
          <div className="rounded-lg p-2 glass-input">
            <input
              placeholder="Search tasks..."
              value={depSearch}
              onChange={(e) => setDepSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none mb-2 px-1 text-text-primary placeholder:text-text-muted"
            />
            <div className="max-h-28 overflow-y-auto space-y-1">
              {filteredDeps.map((t) => {
                const sc = ST[t.s];
                return (
                  <label key={t.id} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-[#c9a96e]"
                      checked={dependencies.includes(t.id)}
                      onChange={() => toggleDep(t.id)}
                    />
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
            {subtasks.map((st, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg glass-input">
                <GripVertical size={12} className="text-text-muted cursor-grab" />
                <span className="text-sm flex-1 text-text-primary">{st}</span>
                <button onClick={() => removeSubtask(i)} className="p-0.5 rounded hover:bg-white/5">
                  <X size={12} className="text-text-muted" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                placeholder="Add subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                className="flex-1 px-3 py-2 rounded-lg text-sm outline-none glass-input text-text-primary placeholder:text-text-muted"
              />
              <button
                onClick={addSubtask}
                className="px-3 py-2 rounded-lg text-sm flex items-center gap-1 bg-accent text-accent-fg"
              >
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
                  {(["Now", "Scheduled", "Recurring"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => setScheduling(o)}
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs border text-center transition-colors"
                      style={{
                        borderColor: scheduling === o ? "#c9a96e" : "rgba(200,169,110,0.1)",
                        color: scheduling === o ? "#c9a96e" : "#a1a1aa",
                        backgroundColor: scheduling === o ? "rgba(201,169,110,0.13)" : "transparent",
                      }}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              {scheduling !== "Now" && (
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
              )}
              {scheduling === "Recurring" && (
                <div>
                  <Label>Repeat</Label>
                  <Select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                    <option value="none">No repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="cron">Custom (cron)</option>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lock */}
        <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-bg-card">
          <input
            type="checkbox"
            className="accent-[#c9a96e]"
            checked={lockTask}
            onChange={(e) => setLockTask(e.target.checked)}
          />
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
        <Button primary onClick={handleSubmit} disabled={!title.trim()}>
          <Plus size={14} /> Create Task
        </Button>
      </div>
    </Modal>
  );
}
