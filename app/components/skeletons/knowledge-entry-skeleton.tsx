import { Skeleton } from "@/components/ui/skeleton";

export function KnowledgeEntrySkeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 px-4 py-2.5 border-b"
          style={{ borderColor: "var(--color-border-default)" }}
        >
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-3.5 flex-1" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  );
}
