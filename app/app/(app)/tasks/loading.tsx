import { TaskCardSkeleton } from "@/components/skeletons/task-card-skeleton";

export default function TasksLoading() {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-border-default flex-shrink-0">
        <div className="h-4 w-16 animate-pulse bg-bg-elevated rounded" />
        <div className="h-7 w-36 animate-pulse bg-bg-elevated rounded-lg" />
        <div className="ml-auto flex gap-2">
          <div className="h-9 w-20 animate-pulse bg-bg-elevated rounded-lg" />
          <div className="h-9 w-28 animate-pulse bg-bg-elevated rounded-lg" />
        </div>
      </div>
      {/* Kanban skeleton */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4">
          {Array.from({ length: 5 }, (_, col) => (
            <div key={col} className="flex-shrink-0" style={{ width: 260 }}>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="h-4 w-20 animate-pulse bg-bg-elevated rounded" />
                <div className="h-5 w-5 animate-pulse bg-bg-elevated rounded-full" />
              </div>
              <div className="space-y-2 p-1">
                {Array.from({ length: col < 2 ? 3 : 1 }, (_, i) => (
                  <TaskCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
