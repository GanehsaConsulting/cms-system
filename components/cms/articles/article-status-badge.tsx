import { statusLabels } from "@/lib/articles/list";
import { cn } from "@/lib/utils";
import type { ArticleStatus } from "@/types/article";

const statusDotClass: Record<ArticleStatus, string> = {
  published: "bg-emerald-500",
  scheduled: "bg-sky-500",
  draft: "bg-amber-500",
  archived: "bg-muted-foreground",
};

interface ArticleStatusBadgeProps {
  status: ArticleStatus;
  className?: string;
}

export function ArticleStatusBadge({
  status,
  className,
}: ArticleStatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", statusDotClass[status])}
      />
      <span>{statusLabels[status]}</span>
    </span>
  );
}
