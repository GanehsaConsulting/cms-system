import { cn } from "@/lib/utils";

interface SidebarPresenceCountBadgeProps {
  count: number;
  className?: string;
}

export function SidebarPresenceCountBadge({
  count,
  className,
}: SidebarPresenceCountBadgeProps) {
  const label = count > 99 ? "99+" : String(Math.max(0, count));

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none flex h-4 min-w-4 items-center justify-center rounded-full",
        "bg-emerald-500 px-1 font-semibold text-[10px] leading-none text-white",
        "shadow-sm ring-2 ring-[rgb(var(--glass-fill-rgb))]",
        className,
      )}
    >
      {label}
    </span>
  );
}
