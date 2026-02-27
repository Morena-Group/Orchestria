import { Skeleton } from "@/components/ui/skeleton";

export function TaskCardSkeleton() {
  return (
    <div className="p-3 rounded-lg glass-input space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-1.5">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-10" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-[22px] w-[22px] rounded-full" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
