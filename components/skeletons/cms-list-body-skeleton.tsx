import { Skeleton } from "@/components/ui/skeleton";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { cn } from "@/lib/utils";

interface CmsListBodySkeletonProps {
  /** When true, show a detail panel column (articles / clients workspace). */
  withDetailPanel?: boolean;
  /** Slim toolbar placeholder above the table (filters stay in the data view). */
  withToolbar?: boolean;
}

/**
 * Content-only list placeholder — title/tabs live in layout or page chrome
 * so navigation does not flash a full-page skeleton.
 */
export function CmsListBodySkeleton({
  withDetailPanel = true,
  withToolbar = true,
}: CmsListBodySkeletonProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {withToolbar ? (
        <div className="mb-4 flex shrink-0 flex-wrap justify-end gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
      ) : null}

      <div
        className={cn(
          "grid min-h-0 flex-1 gap-3",
          withDetailPanel && "xl:grid-cols-[minmax(0,1fr)_22rem]",
        )}
      >
        <GlassSurface
          className={cn("flex min-h-0 flex-col overflow-hidden", CMS_FLEX_CHILD)}
        >
          <div className="space-y-0 border-(--separator) border-b px-4 py-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-48" />
          </div>
          <div className="space-y-px p-px">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="hidden h-5 w-16 sm:block" />
                <Skeleton className="hidden h-5 w-14 md:block" />
              </div>
            ))}
          </div>
        </GlassSurface>

        {withDetailPanel ? (
          <GlassSurface className="hidden space-y-4 p-4 xl:block">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-9 w-full" />
          </GlassSurface>
        ) : null}
      </div>
    </div>
  );
}
