import type { ContentActivityStatus } from "@/types/content-activity";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ContentActivityStatus, string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

const STATUS_CLASS: Record<ContentActivityStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  archived: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
};

interface ContentActivityStatusBadgeProps {
  status: ContentActivityStatus;
  className?: string;
}

export function ContentActivityStatusBadge({
  status,
  className,
}: ContentActivityStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 font-medium text-[11px]",
        STATUS_CLASS[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
