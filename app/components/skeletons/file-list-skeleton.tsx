import { Skeleton } from "@/components/ui/skeleton";

export function FileListSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  );
}
