import { NOTIFICATION_WIDGET_SURFACE } from "@/config/notification-center";
import { CloudSunIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function NotificationWidgetWeather() {
  return (
    <div
      className={cn(
        NOTIFICATION_WIDGET_SURFACE,
        "flex aspect-square flex-col justify-between",
      )}
    >
      <div>
        <p className="font-medium text-[11px] text-muted-foreground">
          South Jakarta
        </p>
        <p className="mt-1 font-semibold text-3xl tracking-tight tabular-nums">
          33°
        </p>
      </div>
      <div className="flex items-end justify-between gap-2">
        <CloudSunIcon className="size-7 text-[#ff9f0a]" />
        <p className="text-right text-[11px] text-muted-foreground leading-tight">
          H:34°
          <br />
          L:26°
        </p>
      </div>
    </div>
  );
}
