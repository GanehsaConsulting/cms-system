import { cn } from "@/lib/utils";
import type { BrandStatus } from "@/types/brand";

interface BrandStatusBadgeProps {
  status: BrandStatus;
  className?: string;
}

export function BrandStatusBadge({ status, className }: BrandStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 font-medium text-[11px]",
        status === "active"
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}
