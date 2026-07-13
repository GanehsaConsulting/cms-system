import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface BannerStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export function BannerStatusBadge({
  isActive,
  className,
}: BannerStatusBadgeProps) {
  return (
    <span
      className={cn(
        RADIUS_DEEP,
        "inline-flex items-center px-2 py-0.5 font-medium text-xs",
        isActive
          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
