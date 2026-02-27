"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      title="Settings Error"
      message={error.message || "Failed to load settings."}
      onRetry={reset}
    />
  );
}
