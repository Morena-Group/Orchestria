"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function TasksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      title="Tasks Error"
      message={error.message || "Failed to load tasks."}
      onRetry={reset}
    />
  );
}
