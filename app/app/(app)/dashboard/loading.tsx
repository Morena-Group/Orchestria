import { DashboardWidgetSkeleton } from "@/components/skeletons/dashboard-widget-skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="h-6 w-48 animate-pulse bg-bg-elevated rounded-lg" />
          <div className="h-4 w-64 animate-pulse bg-bg-elevated rounded-lg" />
        </div>
        <div className="h-9 w-32 animate-pulse bg-bg-elevated rounded-lg" />
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {Array.from({ length: 6 }, (_, i) => (
          <DashboardWidgetSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
