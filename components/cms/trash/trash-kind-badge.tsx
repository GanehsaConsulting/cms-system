import {
  TRASH_KIND_BADGE_CLASS,
  TRASH_KIND_LABELS,
} from "@/config/trash";
import type { TrashKind } from "@/types/trash";
import { cn } from "@/lib/utils";

interface TrashKindBadgeProps {
  kind: TrashKind;
  className?: string;
}

export function TrashKindBadge({ kind, className }: TrashKindBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 font-semibold text-[10px] uppercase tracking-wide",
        TRASH_KIND_BADGE_CLASS[kind],
        className,
      )}
    >
      {TRASH_KIND_LABELS[kind]}
    </span>
  );
}
