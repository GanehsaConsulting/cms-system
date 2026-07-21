import { Skeleton } from "@/components/ui/skeleton";

/** Compact filter/action placeholders for the page header row. */
export function CmsHeaderToolbarSkeleton() {
  return (
    <div className="flex shrink-0 flex-wrap justify-end gap-2">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-28" />
    </div>
  );
}
