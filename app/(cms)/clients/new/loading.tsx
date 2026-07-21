import { CmsFormBodySkeleton } from "@/components/skeletons/cms-form-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SECTION_BODY_PADDING,
      )}
    >
      <CmsFormBodySkeleton />
    </div>
  );
}
