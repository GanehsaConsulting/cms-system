import type { ContentActivityKind } from "@/types/content-activity";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<ContentActivityKind, string> = {
  activity: "Activity",
  promo: "Promo",
};

const KIND_CLASS: Record<ContentActivityKind, string> = {
  activity:
    "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  promo: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

interface ContentActivityKindBadgeProps {
  kind: ContentActivityKind;
  className?: string;
}

export function ContentActivityKindBadge({
  kind,
  className,
}: ContentActivityKindBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 font-medium text-[11px]",
        KIND_CLASS[kind],
        className,
      )}
    >
      {KIND_LABEL[kind]}
    </span>
  );
}
