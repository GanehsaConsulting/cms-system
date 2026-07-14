import { GLASS_SURFACE } from "@/config/glass";
import { DASHBOARD_WIDGET_RADIUS } from "@/config/dashboard";
import { cn } from "@/lib/utils";

type DashboardWidgetVariant = "glass" | "solid" | "tinted";

interface DashboardWidgetProps {
  children: React.ReactNode;
  variant?: DashboardWidgetVariant;
  className?: string;
}

const WIDGET_VARIANTS: Record<DashboardWidgetVariant, string> = {
  glass: cn(
    GLASS_SURFACE,
    "text-card-foreground shadow-[0_4px_16px_rgb(0_0_0/0.08)] dark:shadow-[0_6px_18px_rgb(0_0_0/0.28)]",
  ),
  solid: cn(
    "border-0 bg-linear-to-br from-[#FFFFFF] via-[#F2F2F7] to-[#D8D8DE] text-foreground",
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85),inset_0_-1px_0_0_rgba(0,0,0,0.04),0_4px_16px_rgb(0_0_0/0.1)]",
    "dark:from-[#3A3A3C] dark:via-[#2C2C2E] dark:to-[#1C1C1E] dark:text-white",
    "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_-1px_0_0_rgba(0,0,0,0.45),0_6px_18px_rgb(0_0_0/0.4)]",
  ),
  tinted: cn(
    "border-0 bg-linear-to-br from-[#5AC8FA] to-[#007AFF] text-white",
    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_4px_16px_rgb(0_122_255/0.24)]",
    "dark:from-[#4AB0E0] dark:to-[#0066D6]",
  ),
};

export function DashboardWidget({
  children,
  variant = "glass",
  className,
}: DashboardWidgetProps) {
  return (
    <div
      className={cn(
        DASHBOARD_WIDGET_RADIUS,
        "flex min-h-0 flex-col overflow-hidden",
        WIDGET_VARIANTS[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}
