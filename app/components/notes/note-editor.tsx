"use client";

import type { Note } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Pin, Sparkles, Save } from "lucide-react";

interface NoteEditorProps {
  notes: Note[];
  activeNote: Note;
  noteContent: string;
  onNoteContentChange: (content: string) => void;
  onOpenNote: (note: Note) => void;
  onBack: () => void;
}

export function NoteEditor({
  notes,
  activeNote,
  noteContent,
  onNoteContentChange,
  onOpenNote,
  onBack,
}: NoteEditorProps) {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Note list sidebar */}
      <div
        className="w-64 border-r flex flex-col"
        style={{
          borderColor: "var(--color-border-default)",
          backgroundColor: "var(--color-bg-base)",
        }}
      >
        <div
          className="p-3 border-b flex items-center gap-2"
          style={{ borderColor: "var(--color-border-default)" }}
        >
          <button
            onClick={onBack}
            className="p-1 rounded hover:bg-white/5"
          >
            <ChevronLeft
              size={16}
              style={{ color: "var(--color-text-secondary)" }}
            />
          </button>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            Notes
          </span>
          <button className="ml-auto p-1 rounded hover:bg-white/5">
            <Plus
              size={16}
              style={{ color: "var(--color-text-secondary)" }}
            />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => onOpenNote(n)}
              className="w-full text-left p-2.5 rounded-lg transition-colors"
              style={{
                backgroundColor:
                  activeNote.id === n.id
                    ? "var(--color-bg-elevated)"
                    : "transparent",
              }}
            >
              <div className="flex items-center gap-1.5">
                {n.pinned && (
                  <Pin size={10} style={{ color: "var(--color-accent)" }} />
                )}
                <span
                  className="text-sm font-medium truncate"
                  style={{
                    color:
                      activeNote.id === n.id
                        ? "var(--color-text-primary)"
                        : "var(--color-text-secondary)",
                  }}
                >
                  {n.title}
                </span>
              </div>
              <span
                className="text-[10px] block mt-0.5"
                style={{ color: "var(--color-text-muted)" }}
              >
                {n.updated}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
          style={{ borderColor: "var(--color-border-default)" }}
        >
          <div className="flex items-center gap-3">
            {activeNote.pinned && (
              <Pin size={14} style={{ color: "var(--color-accent)" }} />
            )}
            <input
              defaultValue={activeNote.title}
              className="text-lg font-semibold bg-transparent outline-none"
              style={{ color: "var(--color-text-primary)" }}
            />
            <Badge color="#c9a96e" small>
              {activeNote.proj}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Edited {activeNote.updated}
            </span>
            <button
              className="p-1.5 rounded hover:bg-white/5"
              title={activeNote.pinned ? "Unpin" : "Pin"}
            >
              <Pin
                size={14}
                style={{
                  color: activeNote.pinned
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
                }}
              />
            </button>
            <Button>
              <Sparkles size={12} /> Propose Tasks
            </Button>
            <Button primary>
              <Save size={12} /> Save
            </Button>
          </div>
        </div>

        {/* Text editor */}
        <div className="flex-1 overflow-y-auto p-6">
          <textarea
            value={noteContent}
            onChange={(e) => onNoteContentChange(e.target.value)}
            className="w-full h-full bg-transparent text-sm outline-none resize-none font-mono leading-relaxed"
            style={{ color: "var(--color-text-primary)", minHeight: "100%" }}
            placeholder="Start writing..."
          />
        </div>

        {/* AI assist bar */}
        <div
          className="px-6 py-2.5 border-t flex items-center gap-3"
          style={{
            borderColor: "var(--color-border-default)",
            backgroundColor: "var(--color-bg-base)",
          }}
        >
          <Sparkles size={14} style={{ color: "var(--color-accent)" }} />
          <input
            placeholder="Ask AI to expand, summarize, or restructure this note..."
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: "var(--color-text-primary)" }}
          />
          <button
            className="px-3 py-1.5 rounded-lg text-[10px] font-medium"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-accent-fg)",
            }}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
