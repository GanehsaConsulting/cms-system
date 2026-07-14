import Link from "next/link";
import { DashboardScrollableBody } from "@/components/cms/dashboard/dashboard-scrollable-body";
import { DashboardWidget } from "@/components/cms/dashboard/dashboard-widget";
import { DASHBOARD_RECENT_WIDGET_HEIGHT } from "@/config/dashboard";
import { formatClientDateParts } from "@/lib/clients/list";
import type { DashboardRecentItem } from "@/lib/dashboard/recent";
import { cn } from "@/lib/utils";

interface DashboardRecentWidgetProps {
  items: DashboardRecentItem[];
  className?: string;
}

export function DashboardRecentWidget({
  items,
  className,
}: DashboardRecentWidgetProps) {
  const isEmpty = items.length === 0;

  return (
    <DashboardWidget
      variant="solid"
      className={cn(
        DASHBOARD_RECENT_WIDGET_HEIGHT,
        "p-3 sm:p-3.5",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">Recent</p>
          <p className="text-muted-foreground text-xs">
            Latest updates across modules
          </p>
        </div>
      </div>

      <DashboardScrollableBody empty={isEmpty}>
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="font-medium text-sm">Nothing recent yet</p>
            <p className="mt-1 max-w-xs text-muted-foreground text-xs leading-relaxed">
              Create or edit content to see it appear here.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => {
              const updated = formatClientDateParts(item.updatedAt);

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-black/4 dark:hover:bg-white/6"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">{item.title}</p>
                      <p className="truncate text-muted-foreground text-xs">
                        {item.subtitle} · {updated.date}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </DashboardScrollableBody>
    </DashboardWidget>
  );
}
