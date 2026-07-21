import { Skeleton } from "@/components/ui/skeleton";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { cn } from "@/lib/utils";

/** Form body only — back link / title chrome stays visible when lifted. */
export function CmsFormBodySkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      <div className="flex shrink-0 justify-end gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <GlassSurface
          className={cn("space-y-4 overflow-auto p-4", CMS_FLEX_CHILD)}
        >
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="min-h-[220px] w-full rounded-xl" />
        </GlassSurface>
        <GlassSurface className="hidden space-y-3 p-4 lg:block">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </GlassSurface>
      </div>
    </div>
  );
}
