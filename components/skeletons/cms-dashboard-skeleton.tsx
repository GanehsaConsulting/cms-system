import { Skeleton } from "@/components/ui/skeleton";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CMS_FLEX_CHILD, SHELL_PADDING, STACK_GAP } from "@/config/spacing";
import { cn } from "@/lib/utils";

/** Placeholder for dashboard greeting + widget grid while server data loads. */
export function CmsDashboardSkeleton() {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SHELL_PADDING,
      )}
    >
      <div className="mb-4 shrink-0 space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className={cn("grid min-h-0 flex-1 content-start", STACK_GAP)}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <GlassSurface key={index} className="space-y-3 p-4">
              <Skeleton className="size-8 rounded-xl" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-24" />
            </GlassSurface>
          ))}
        </div>

        <div className="grid min-h-0 gap-3 lg:grid-cols-2">
          <GlassSurface className={cn("space-y-3 p-4", CMS_FLEX_CHILD)}>
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </GlassSurface>
          <GlassSurface className={cn("space-y-3 p-4", CMS_FLEX_CHILD)}>
            <Skeleton className="h-5 w-36" />
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </GlassSurface>
        </div>
      </div>
    </div>
  );
}
