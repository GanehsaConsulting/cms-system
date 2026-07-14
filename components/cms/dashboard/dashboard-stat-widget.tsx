import type { Icon } from "@/lib/icons";
import { DashboardWidget } from "@/components/cms/dashboard/dashboard-widget";
import { DASHBOARD_BENTO_TILE_HEIGHT } from "@/config/dashboard";
import { cn } from "@/lib/utils";

interface DashboardStatWidgetProps {
  label: string;
  value: string | number;
  description?: string;
  icon: Icon;
  variant?: "glass" | "solid" | "tinted";
  className?: string;
}

export function DashboardStatWidget({
  label,
  value,
  description,
  icon: Icon,
  variant = "glass",
  className,
}: DashboardStatWidgetProps) {
  const isTinted = variant === "tinted";

  return (
    <DashboardWidget
      variant={variant}
      className={cn(
        DASHBOARD_BENTO_TILE_HEIGHT,
        "justify-between p-3 sm:p-3.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "font-semibold text-[10px] uppercase tracking-wide",
            isTinted ? "text-white/85" : "text-muted-foreground",
          )}
        >
          {label}
        </p>
        <Icon
          className={cn(
            "size-4 shrink-0",
            isTinted ? "text-white/95" : "text-foreground/55",
          )}
        />
      </div>
      <div>
        <p
          className={cn(
            "font-semibold text-2xl tabular-nums tracking-tight sm:text-3xl",
            isTinted ? "text-white" : "text-foreground",
          )}
        >
          {value}
        </p>
        {description ? (
          <p
            className={cn(
              "mt-0.5 truncate text-[11px] leading-snug",
              isTinted ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </DashboardWidget>
  );
}
