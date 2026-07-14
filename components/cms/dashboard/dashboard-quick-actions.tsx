"use client";

import Link from "next/link";
import { DashboardWidget } from "@/components/cms/dashboard/dashboard-widget";
import { useBrand } from "@/components/shared/brand-provider";
import { RADIUS_DEEP } from "@/config/shape";
import { filterDashboardQuickActionsForBrand } from "@/lib/dashboard/brand-access";
import { cn } from "@/lib/utils";

interface DashboardQuickActionsProps {
  className?: string;
}

export function DashboardQuickActions({
  className,
}: DashboardQuickActionsProps) {
  const { activeBrand } = useBrand();
  const actions = filterDashboardQuickActionsForBrand(activeBrand);

  if (actions.length === 0) {
    return null;
  }

  const columns =
    actions.length === 1
      ? "grid-cols-1"
      : actions.length === 2
        ? "grid-cols-2"
        : actions.length === 3
          ? "grid-cols-3"
          : "grid-cols-2 sm:grid-cols-4";

  return (
    <DashboardWidget variant="glass" className={cn("p-2", className)}>
      <div className={cn("grid gap-2", columns)}>
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.id}
              href={action.href}
              className={cn(
                RADIUS_DEEP,
                action.surface,
                "flex min-h-17 flex-col justify-between p-2.5 text-white transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:min-h-19",
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
