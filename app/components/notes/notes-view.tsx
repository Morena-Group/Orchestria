"use client";

import { useState, useCallback } from "react";
import type { Note } from "@/lib/types";
import { useNotes } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NoteCard } from "./note-card";
import { NoteEditor } from "./note-editor";
import { CondenseBanner } from "./condense-banner";
import { FileText, Plus, Shrink } from "lucide-react";

export function NotesView() {
  const { notes, createNote, updateNote, togglePin } = useNotes();
  const [condense, setCondense] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  const openNote = (n: Note) => {
    setActiveNote(n);
    setNoteContent(n.content);
    setNoteTitle(n.title);
  };

  const handleNewNote = useCallback(async () => {
    const newNote = await createNote("Untitled Note", "", "");
    if (newNote) openNote(newNote);
  }, [createNote]);

  const handleSave = useCallback(() => {
    if (!activeNote) return;
    updateNote(activeNote.id, { title: noteTitle, content: noteContent });
    setActiveNote((prev) =>
      prev ? { ...prev, title: noteTitle, content: noteContent, updated: "Just now" } : null
    );
  }, [activeNote, noteTitle, noteContent, updateNote]);

  const handlePinToggle = useCallback(
    (noteId: string) => {
      togglePin(noteId);
      if (activeNote?.id === noteId) {
        setActiveNote((prev) => (prev ? { ...prev, pinned: !prev.pinned } : null));
      }
    },
    [activeNote, togglePin]
  );

  // Editor view
  if (activeNote) {
    return (
      <NoteEditor
        notes={notes}
        activeNote={activeNote}
        noteContent={noteContent}
        noteTitle={noteTitle}
        onNoteContentChange={setNoteContent}
        onNoteTitleChange={setNoteTitle}
        onOpenNote={openNote}
        onBack={() => setActiveNote(null)}
        onSave={handleSave}
        onPinToggle={handlePinToggle}
        onNewNote={handleNewNote}
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
          <Button primary onClick={handleNewNote}>
            <Plus size={16} /> New Note
          </Button>
        </div>
      </div>

      {condense && <CondenseBanner />}

      {notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          desc="Capture ideas, decisions, and context. The AI can propose tasks from your notes or condense them by theme."
          action="Create First Note"
          onAction={handleNewNote}
        />
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {notes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onClick={() => openNote(n)}
              onPin={() => handlePinToggle(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
