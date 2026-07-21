import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
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
      <CmsListBodySkeleton withDetailPanel={false} />
    </div>
  );
}
