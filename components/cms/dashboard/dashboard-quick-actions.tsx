import Link from "next/link";
import { DashboardWidget } from "@/components/cms/dashboard/dashboard-widget";
import { DASHBOARD_QUICK_ACTIONS } from "@/config/dashboard";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface DashboardQuickActionsProps {
  className?: string;
}

export function DashboardQuickActions({
  className,
}: DashboardQuickActionsProps) {
  return (
    <DashboardWidget
      variant="glass"
      className={cn("p-2", className)}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {DASHBOARD_QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.id}
              href={action.href}
              className={cn(
                RADIUS_DEEP,
                action.surface,
                "flex min-h-[4.25rem] flex-col justify-between p-2.5 text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:min-h-[4.75rem]",
              )}
            >
              <Icon className="size-4 shrink-0 text-white drop-shadow-sm" />
              <span className="font-semibold text-xs leading-snug">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </DashboardWidget>
  );
}
