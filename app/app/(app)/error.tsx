"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      title="Something went wrong"
      message={error.message || "An unexpected error occurred."}
      onRetry={reset}
    />
  );
}
