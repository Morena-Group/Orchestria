"use client";

import type { StorageFile } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Download, Trash2, Brain, File, Code, FileText, Eye, Database } from "lucide-react";

const TYPE_ICONS: Record<string, typeof File> = { code: Code, doc: FileText, image: Eye, data: Database };
const STATUS_COLORS: Record<string, string> = {
  approved: "var(--color-text-primary)",
  review: "var(--color-accent)",
  uploaded: "var(--color-text-secondary)",
};

interface FileDetailPanelProps {
  file: StorageFile;
  onClose: () => void;
}

export function FileDetailPanel({ file, onClose }: FileDetailPanelProps) {
  const TypeIcon = TYPE_ICONS[file.type] ?? File;

  return (
    <div
      className="w-72 border-l flex-shrink-0 overflow-y-auto"
      style={{
        borderColor: "var(--color-border-default)",
        backgroundColor: "var(--color-bg-deep)",
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>
            File Details
          </span>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5">
            <X size={12} style={{ color: "var(--color-text-secondary)" }} />
          </button>
        </div>

        {/* File icon preview */}
        <div
          className="w-full h-32 rounded-lg mb-3 flex items-center justify-center"
          style={{ backgroundColor: "var(--color-bg-card)" }}
        >
          <TypeIcon size={32} style={{ color: "var(--color-accent)" }} />
        </div>

        <h3
          className="text-sm font-semibold mb-1 break-all"
          style={{ color: "var(--color-text-primary)" }}
        >
          {file.name}
        </h3>

        <div className="space-y-2.5 mt-3">
          <div><Label>Project</Label><span className="text-xs" style={{ color: "var(--color-text-primary)" }}>{file.projName}</span></div>
          <div><Label>Type</Label><span className="text-xs" style={{ color: "var(--color-text-primary)" }}>{file.type}</span></div>
          <div><Label>Size</Label><span className="text-xs" style={{ color: "var(--color-text-primary)" }}>{file.size}</span></div>
          <div><Label>Created</Label><span className="text-xs" style={{ color: "var(--color-text-primary)" }}>{file.date}</span></div>
          {file.worker && file.workerType && (
            <div>
              <Label>Created by</Label>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Avatar type={file.workerType} size={18} role="worker" />
                <span className="text-xs" style={{ color: "var(--color-text-primary)" }}>{file.worker}</span>
              </div>
            </div>
          )}
          {file.task && (
            <div><Label>Task</Label><span className="text-xs" style={{ color: "var(--color-text-primary)" }}>{file.task}</span></div>
          )}
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {file.tags.map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: "var(--color-accent-dim)", color: "var(--color-accent-hover)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Badge color={STATUS_COLORS[file.status] ?? "#71717a"}>{file.status}</Badge>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border-default)" }}>
          <Button><Download size={12} /> Download</Button>
          <button className="p-2 rounded-lg border hover:bg-white/5" style={{ borderColor: "var(--color-border-default)" }}>
            <Trash2 size={14} style={{ color: "var(--color-error)" }} />
          </button>
        </div>

        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "var(--color-bg-card)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Brain size={12} style={{ color: "var(--color-accent)" }} />
            <span className="text-[10px] font-medium" style={{ color: "var(--color-text-primary)" }}>Ask Orchestrator</span>
          </div>
          <input
            placeholder='"Summarize this file" or "Create tasks from this"'
            className="glass-input w-full px-2 py-1.5 rounded text-[10px] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
