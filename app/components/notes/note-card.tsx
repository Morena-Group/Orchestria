"use client";

import type { Note } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Pin, Sparkles } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

function getPreview(content: string): string {
  return content
    .split("\n")
    .filter((l) => !l.startsWith("#") && l.trim())
    .slice(0, 2)
    .join(" ");
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  return (
    <div
      onClick={onClick}
      className="glass-card p-4 rounded-xl cursor-pointer transition-colors hover:border-accent"
    >
      {/* Title row */}
      <div className="flex items-center gap-2 mb-2">
        {note.pinned && (
          <Pin size={12} style={{ color: "var(--color-accent)" }} />
        )}
        <h3
          className="text-sm font-semibold flex-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          {note.title}
        </h3>
        {!note.pinned && (
          <button
            className="p-1 rounded hover:bg-white/5"
            title="Pin"
            onClick={(e) => e.stopPropagation()}
          >
            <Pin size={12} style={{ color: "var(--color-text-muted)" }} />
          </button>
        )}
      </div>

      {/* Project badge */}
      <Badge color="#c9a96e" small>
        {note.proj}
      </Badge>

      {/* Content preview */}
      <p
        className="text-sm mt-2 line-clamp-2"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {getPreview(note.content)}
      </p>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-3 pt-3 border-t"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        {note.proposed > 0 ? (
          <Badge color="var(--color-text-primary)" bg="var(--color-bg-elevated)" small>
            {note.proposed} tasks proposed
          </Badge>
        ) : (
          <button
            className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 border"
            style={{
              borderColor: "var(--color-border-default)",
              color: "var(--color-accent-hover)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Sparkles size={12} /> Propose Tasks
          </button>
        )}
        <span
          className="text-[10px]"
          style={{ color: "var(--color-text-muted)" }}
        >
          {note.updated}
        </span>
      </div>
    </div>
  );
}
