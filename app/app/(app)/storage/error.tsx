"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function StorageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      title="Storage Error"
      message={error.message || "Failed to load storage data."}
      onRetry={reset}
    />
  );
}
