import { Skeleton } from "@/components/ui/skeleton";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CMS_FLEX_CHILD, SHELL_PADDING } from "@/config/spacing";
import { cn } from "@/lib/utils";

/** Placeholder for Files & Media library (folder tree + grid). */
export function CmsMediaPageSkeleton() {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SHELL_PADDING,
      )}
    >
      <header className="mb-4 shrink-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </header>

      <GlassSurface
        className={cn(
          "grid min-h-0 flex-1 overflow-hidden md:grid-cols-[14rem_minmax(0,1fr)]",
          CMS_FLEX_CHILD,
        )}
      >
        <div className="space-y-2 border-(--separator) border-b p-3 md:border-r md:border-b-0">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
        <div className="grid content-start gap-2.5 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      </GlassSurface>
    </div>
  );
}
