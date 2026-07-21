import { cn } from "@/lib/utils";

interface SidebarCountBadgeProps {
  count: number;
  className?: string;
}

/** Compact count pill for sidebar / dock triggers (presence, notifications). */
export function SidebarCountBadge({ count, className }: SidebarCountBadgeProps) {
  if (count <= 0) {
    return null;
  }

  const label = count > 99 ? "99+" : String(count);

  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none flex h-3.5 min-w-3.5 items-center justify-center rounded-full",
        "bg-red-500 px-1 font-semibold text-[9px] leading-none text-white shadow-sm",
        className,
      )}
    >
      {label}
    </span>
  );
}
