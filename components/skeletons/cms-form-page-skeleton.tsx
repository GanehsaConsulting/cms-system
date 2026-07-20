import { Skeleton } from "@/components/ui/skeleton";
import { SolidSurface } from "@/components/shared/solid-surface";
import { SHELL_PADDING, STACK_GAP } from "@/config/spacing";
import { cn } from "@/lib/utils";

/** Placeholder for article/price/client create & edit form pages. */
export function CmsFormPageSkeleton() {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SHELL_PADDING,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <SolidSurface className="space-y-6 p-4 md:p-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="min-h-[280px] w-full rounded-xl" />
          </div>
        </SolidSurface>

        <aside className={cn("flex flex-col", STACK_GAP)}>
          {Array.from({ length: 3 }).map((_, index) => (
            <SolidSurface key={index} className="space-y-3 p-4 md:p-5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </SolidSurface>
          ))}
        </aside>
      </div>
    </div>
  );
}
