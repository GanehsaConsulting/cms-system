import Link from "next/link";
import { DashboardWidget } from "@/components/cms/dashboard/dashboard-widget";
import { DASHBOARD_RECENT_WIDGET_HEIGHT } from "@/config/dashboard";
import { FileTextIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface DashboardArticlesFocusWidgetProps {
  total: number;
  published: number;
  drafts: number;
  className?: string;
}

export function DashboardArticlesFocusWidget({
  total,
  published,
  drafts,
  className,
}: DashboardArticlesFocusWidgetProps) {
  const publishedPercent =
    total === 0 ? 0 : Math.round((published / total) * 100);

  return (
    <DashboardWidget
      variant="solid"
      className={cn(
        DASHBOARD_RECENT_WIDGET_HEIGHT,
        "justify-between p-3 sm:p-3.5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm">Articles</p>
          <p className="text-muted-foreground text-[11px]">Publish readiness</p>
        </div>
        <FileTextIcon className="size-4 text-foreground/50" />
      </div>

      <div className="flex flex-1 items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-3xl tabular-nums tracking-tight sm:text-4xl">
            {publishedPercent}%
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            {published} published · {drafts} drafts
          </p>
        </div>

        <div className="relative size-16 shrink-0 sm:size-[4.5rem]">
          <svg
            viewBox="0 0 36 36"
            className="size-full -rotate-90"
            role="img"
            aria-label={`${publishedPercent}% published`}
          >
            <title>{`${publishedPercent}% published`}</title>
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              className="stroke-black/8 dark:stroke-white/12"
              strokeWidth="4"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              className="stroke-[#007AFF]"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${publishedPercent} 100`}
            />
          </svg>
        </div>
      </div>

      <Link
        href="/articles"
        className="font-medium text-primary text-xs hover:underline"
      >
        Manage articles
      </Link>
    </DashboardWidget>
  );
}
