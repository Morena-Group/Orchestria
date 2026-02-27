"use client";

import { useState } from "react";
import type { Note } from "@/lib/types";
import { NOTES_DATA } from "@/lib/data/notes";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NoteCard } from "./note-card";
import { NoteEditor } from "./note-editor";
import { CondenseBanner } from "./condense-banner";
import { FileText, Plus, Shrink } from "lucide-react";

export function NotesView() {
  const [condense, setCondense] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState("");

  const openNote = (n: Note) => {
    setActiveNote(n);
    setNoteContent(n.content);
  };

  // Editor view
  if (activeNote) {
    return (
      <NoteEditor
        notes={NOTES_DATA}
        activeNote={activeNote}
        noteContent={noteContent}
        onNoteContentChange={setNoteContent}
        onOpenNote={openNote}
        onBack={() => setActiveNote(null)}
      />
    );
  }

  // Grid view
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Notes
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => setCondense((p) => !p)}>
            <Shrink size={14} /> Condense
          </Button>
          <Button primary>
            <Plus size={16} /> New Note
          </Button>
        </div>
      </div>

      {condense && <CondenseBanner />}

      {NOTES_DATA.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          desc="Capture ideas, decisions, and context. The AI can propose tasks from your notes or condense them by theme."
          action="Create First Note"
        />
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {NOTES_DATA.map((n) => (
            <NoteCard key={n.id} note={n} onClick={() => openNote(n)} />
          ))}
        </div>
      )}
    </div>
  );
}
