"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorDisplayProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-sm text-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--color-error-muted)" }}
        >
          <AlertTriangle size={24} style={{ color: "var(--color-error)" }} />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-text-primary">{title}</h3>
        <p className="text-sm mb-4 text-text-secondary">{message}</p>
        {onRetry && (
          <Button primary onClick={onRetry}>Try Again</Button>
        )}
      </div>
    </div>
  );
}
