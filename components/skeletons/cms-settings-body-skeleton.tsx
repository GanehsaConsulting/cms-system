import { Skeleton } from "@/components/ui/skeleton";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { cn } from "@/lib/utils";

/** Settings table/docs body — title/tabs/filters stay in the settings layout. */
export function CmsSettingsBodySkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <GlassSurface
        className={cn("flex min-h-0 flex-col overflow-hidden", CMS_FLEX_CHILD)}
      >
        <div className="border-(--separator) border-b px-4 py-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-3 w-48" />
        </div>
        <div className="space-y-px p-px">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 px-4 py-3.5">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </GlassSurface>
    </div>
  );
}
