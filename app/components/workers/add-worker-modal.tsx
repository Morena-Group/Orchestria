"use client";

import { useState } from "react";
import { Bot, User, Smartphone, Mail, Globe } from "lucide-react";
import { HUMAN_SKILLS } from "@/lib/data/workers";
import { useWorkers } from "@/lib/hooks";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddWorkerModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddWorkerModal({ open, onClose }: AddWorkerModalProps) {
  const [isHuman, setIsHuman] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactMethod, setContactMethod] = useState("In-App");
  const [humanDescription, setHumanDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [aiType, setAiType] = useState("claude-cli");
  const [role, setRole] = useState("worker");
  const [model, setModel] = useState("");
  const [thinkLevel, setThinkLevel] = useState("standard");

  function toggleSkill(skillId: string) {
    setSkills((prev) =>
      prev.includes(skillId) ? prev.filter((s) => s !== skillId) : [...prev, skillId]
    );
  }

  const { addWorker } = useWorkers();

  async function handleSubmit() {
    if (!name.trim()) return;
    await addWorker({
      name: name.trim(),
      type: isHuman ? "human" : aiType as import("@/lib/types").WorkerType,
      role: role as import("@/lib/types").WorkerRole,
      status: "offline",
      active: 0,
      done: 0,
      model: isHuman ? null : (model || null),
      think: isHuman ? null : thinkLevel,
      isHuman,
      skills: isHuman ? skills : undefined,
      email: isHuman ? email : undefined,
      contact: isHuman ? contactMethod : undefined,
    });
    // Reset form
    setName("");
    setEmail("");
    setIsHuman(false);
    setModel("");
    setSkills([]);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Worker" maxWidth="max-w-md">
      <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
        {/* Type toggle */}
        <div className="flex gap-2">
          {[
            { id: "ai", label: "AI Agent", icon: Bot },
            { id: "human", label: "Human", icon: User },
          ].map((t) => {
            const active = t.id === "human" ? isHuman : !isHuman;
            return (
              <button
                key={t.id}
                onClick={() => setIsHuman(t.id === "human")}
                className="flex-1 px-4 py-2 rounded-lg text-sm border text-center flex items-center justify-center gap-2 transition-colors"
                style={{
                  borderColor: active ? "#c9a96e" : "var(--color-border-default)",
                  backgroundColor: active ? "rgba(201,169,110,0.13)" : "transparent",
                  color: active ? "#c9a96e" : "#a1a1aa",
                }}
              >
                <t.icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        <div>
          <Label>Name</Label>
          <Input
            placeholder={isHuman ? "e.g. Sarah Designer" : "e.g. Claude Research"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {isHuman ? (
          <>
            <div>
              <Label>Email</Label>
              <Input
                placeholder="sarah@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Contact Method</Label>
              <div className="flex gap-2">
                {[
                  { l: "In-App", i: Smartphone },
                  { l: "Email", i: Mail },
                  { l: "Webhook", i: Globe },
                ].map((m) => (
                  <button
                    key={m.l}
                    onClick={() => setContactMethod(m.l)}
                    className="flex-1 px-3 py-2 rounded-lg text-xs border text-center flex items-center justify-center gap-1 transition-colors"
                    style={{
                      borderColor: contactMethod === m.l ? "#c9a96e" : "var(--color-border-default)",
                      color: contactMethod === m.l ? "#c9a96e" : "#a1a1aa",
                    }}
                  >
                    <m.i size={12} /> {m.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none glass-input text-text-primary placeholder:text-text-muted"
                rows={2}
                placeholder="Role, responsibilities, expertise areas..."
                value={humanDescription}
                onChange={(e) => setHumanDescription(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label>Skills</Label>
                <div className="relative group">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 cursor-help text-text-muted">?</span>
                  <div className="absolute bottom-full left-0 mb-1 w-48 p-2 rounded-lg text-[10px] bg-black/90 text-white hidden group-hover:block z-10">
                    Skills help the orchestrator decide which tasks to assign to this person.
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {HUMAN_SKILLS.map((sk) => (
                  <label
                    key={sk.id}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors hover:border-accent border-border-default bg-bg-card"
                    title={sk.d}
                  >
                    <input
                      type="checkbox"
                      className="accent-[#c9a96e]"
                      checked={skills.includes(sk.id)}
                      onChange={() => toggleSkill(sk.id)}
                    />
                    <span className="text-xs text-text-primary">{sk.l}</span>
                  </label>
                ))}
              </div>
              <Input
                placeholder="+ Add custom skill..."
                className="mt-2"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
              />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-bg-card">
              <input
                type="checkbox"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="accent-[#c9a96e]"
              />
              <div>
                <span className="text-sm text-text-primary">Auto-escalate blocked tasks</span>
                <p className="text-[10px] text-text-muted">
                  Automatically assign AI-blocked tasks matching this person&apos;s skills
                </p>
              </div>
            </label>
          </>
        ) : (
          <>
            <div>
              <Label>Type</Label>
              <Select value={aiType} onChange={(e) => setAiType(e.target.value)}>
                <option value="claude-cli">Claude CLI</option>
                <option value="gemini-cli">Gemini CLI</option>
                <option value="chatgpt-cli">ChatGPT CLI</option>
                <option value="kimi-cli">Kimi CLI</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div>
              <Label>Role</Label>
              <div className="flex gap-2">
                {["worker", "orchestrator", "both"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className="flex-1 px-3 py-2 rounded-lg text-sm border text-center transition-colors capitalize"
                    style={{
                      borderColor: role === r ? "#c9a96e" : "var(--color-border-default)",
                      backgroundColor: role === r ? "rgba(201,169,110,0.13)" : "transparent",
                      color: role === r ? "#c9a96e" : "var(--color-text-secondary)",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Model</Label>
              <Input
                placeholder="e.g. claude-opus-4"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            <div>
              <Label>Thinking Level</Label>
              <Select value={thinkLevel} onChange={(e) => setThinkLevel(e.target.value)}>
                <option value="standard">Standard</option>
                <option value="deep">Deep</option>
                <option value="minimal">Minimal</option>
              </Select>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 p-4 border-t border-border-default">
        <Button onClick={onClose}>Cancel</Button>
        <Button primary onClick={handleSubmit} disabled={!name.trim()}>Create</Button>
      </div>
    </Modal>
  );
}
