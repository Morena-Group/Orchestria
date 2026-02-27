"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      title="Dashboard Error"
      message={error.message || "Failed to load dashboard data."}
      onRetry={reset}
    />
  );
}
