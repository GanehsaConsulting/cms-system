import { Skeleton } from "@/components/ui/skeleton";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CMS_FLEX_CHILD, GRID_GAP } from "@/config/spacing";
import { cn } from "@/lib/utils";

interface CmsMediaBodySkeletonProps {
  withToolbar?: boolean;
}

/** Media library content only (folders + grid). */
export function CmsMediaBodySkeleton({
  withToolbar = false,
}: CmsMediaBodySkeletonProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {withToolbar ? (
        <div className="mb-4 flex shrink-0 justify-end gap-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-8 w-24" />
        </div>
      ) : null}
      <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-[14rem_minmax(0,1fr)]">
        <GlassSurface className="hidden space-y-2 p-3 md:block">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </GlassSurface>
        <GlassSurface className={cn("overflow-auto p-3", CMS_FLEX_CHILD)}>
          <div
            className={cn(
              "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
              GRID_GAP,
            )}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}
