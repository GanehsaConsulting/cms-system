import type { Icon } from "@/lib/icons";
import type { WidgetTileStyle } from "@/config/widget-tiles";
import { RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string | number;
  description?: string;
  icon: Icon;
  style: WidgetTileStyle;
}

export function StatTile({
  label,
  value,
  description,
  icon: Icon,
  style,
}: StatTileProps) {
  return (
    <div
      className={cn(
        RADIUS_INNER,
        "flex min-h-22 flex-col justify-between px-3.5 py-3 sm:py-4",
        style.surface,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "font-semibold text-[11px] uppercase tracking-wide sm:text-xs",
            style.labelColor,
          )}
        >
          {label}
        </p>
        <Icon className={cn("size-5 shrink-0 sm:size-6", style.iconColor)} />
      </div>
      <div>
        <p
          className={cn(
            "font-semibold text-2xl tabular-nums tracking-tight sm:text-3xl",
            style.valueColor,
          )}
        >
          {value}
        </p>
        {description ? (
          <p className={cn("mt-1 text-xs", style.labelColor)}>{description}</p>
        ) : null}
      </div>
    </div>
  );
}
