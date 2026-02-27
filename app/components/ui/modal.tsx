"use client";

import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  header?: ReactNode;
  maxWidth?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, header, maxWidth = "max-w-lg", children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`rounded-xl border border-border-default bg-bg-deep ${maxWidth} w-full max-h-[85vh] overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {header ? (
          header
        ) : title ? (
          <div className="flex items-center justify-between p-4 border-b border-border-default">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/5 text-text-secondary"
            >
              <X size={16} />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
