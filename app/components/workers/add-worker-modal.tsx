"use client";

import { useState } from "react";
import { X, Bot, User, Smartphone, Mail, Globe } from "lucide-react";
import { HUMAN_SKILLS } from "@/lib/data/workers";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddWorkerModalProps {
  onClose: () => void;
}

export function AddWorkerModal({ onClose }: AddWorkerModalProps) {
  const [isHuman, setIsHuman] = useState(false);
  const [contactMethod, setContactMethod] = useState("In-App");

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="rounded-xl border border-border-default bg-bg-base p-6 w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Add Worker</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5 text-text-secondary">
            <X size={16} />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 mb-4">
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

        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input placeholder={isHuman ? "e.g. Sarah Designer" : "e.g. Claude Research"} />
          </div>

          {isHuman ? (
            <>
              <div>
                <Label>Email</Label>
                <Input placeholder="sarah@company.com" type="email" />
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
                      <input type="checkbox" className="accent-[#c9a96e]" />
                      <span className="text-xs text-text-primary">{sk.l}</span>
                    </label>
                  ))}
                </div>
                <Input placeholder="+ Add custom skill..." className="mt-2" />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-bg-card">
                <input type="checkbox" defaultChecked className="accent-[#c9a96e]" />
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
                <Select>
                  <option>Claude CLI</option>
                  <option>Gemini CLI</option>
                  <option>ChatGPT CLI</option>
                  <option>Kimi CLI</option>
                  <option>Other</option>
                </Select>
              </div>

              <div>
                <Label>Role</Label>
                <div className="flex gap-2">
                  {["Worker", "Orchestrator", "Both"].map((r) => (
                    <button
                      key={r}
                      className="flex-1 px-3 py-2 rounded-lg text-sm border text-center transition-colors border-border-default text-text-secondary hover:border-accent"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Model</Label>
                <Input placeholder="e.g. claude-opus-4" />
              </div>

              <div>
                <Label>Thinking Level</Label>
                <Select>
                  <option>Standard</option>
                  <option>Deep</option>
                  <option>Minimal</option>
                </Select>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary>Create</Button>
        </div>
      </div>
    </div>
  );
}
