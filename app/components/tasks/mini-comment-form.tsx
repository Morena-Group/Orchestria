"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";

interface MiniCommentFormProps {
  actionLabel: string;
  onSubmit: (comment: string) => void;
  onCancel: () => void;
}

export function MiniCommentForm({ actionLabel, onSubmit, onCancel }: MiniCommentFormProps) {
  const [comment, setComment] = useState("");

  return (
    <div
      className="p-2 rounded-lg border mt-1"
      style={{ borderColor: "var(--color-border-default)", backgroundColor: "var(--color-bg-card)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full px-2 py-1.5 rounded text-xs outline-none resize-none glass-input text-text-primary placeholder:text-text-muted"
        rows={2}
        autoFocus
      />
      <div className="flex justify-end gap-1.5 mt-1.5">
        <button
          onClick={onCancel}
          className="px-2 py-1 rounded text-[10px] text-text-secondary hover:bg-white/5"
        >
          <X size={10} />
        </button>
        <button
          onClick={() => onSubmit(comment)}
          disabled={!comment.trim()}
          className="px-2.5 py-1 rounded text-[10px] flex items-center gap-1 bg-accent text-accent-fg disabled:opacity-50"
        >
          <Send size={10} /> {actionLabel}
        </button>
      </div>
    </div>
  );
}
