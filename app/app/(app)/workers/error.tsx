"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function WorkersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      title="Workers Error"
      message={error.message || "Failed to load workers."}
      onRetry={reset}
    />
  );
}
