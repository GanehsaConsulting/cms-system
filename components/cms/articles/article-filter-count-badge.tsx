import { cn } from "@/lib/utils";

interface ArticleFilterCountBadgeProps {
  count: number;
  isActive?: boolean;
}

export function ArticleFilterCountBadge({
  count,
  isActive = false,
}: ArticleFilterCountBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-4 min-w-4 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-1.5 font-semibold text-[10px] tabular-nums leading-none",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-background/20 text-muted-foreground",
      )}
    >
      {count}
    </span>
  );
}
