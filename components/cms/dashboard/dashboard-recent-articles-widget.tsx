import Link from "next/link";
import { DashboardScrollableBody } from "@/components/cms/dashboard/dashboard-scrollable-body";
import { DashboardWidget } from "@/components/cms/dashboard/dashboard-widget";
import { DASHBOARD_RECENT_WIDGET_HEIGHT } from "@/config/dashboard";
import { formatClientDateParts } from "@/lib/clients/list";
import type { Article } from "@/types/article";
import { cn } from "@/lib/utils";

interface DashboardRecentArticlesWidgetProps {
  articles: Article[];
  className?: string;
}

const STATUS_LABEL: Record<Article["status"], string> = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

export function DashboardRecentArticlesWidget({
  articles,
  className,
}: DashboardRecentArticlesWidgetProps) {
  const isEmpty = articles.length === 0;

  return (
    <DashboardWidget
      variant="glass"
      className={cn(
        DASHBOARD_RECENT_WIDGET_HEIGHT,
        "p-3 sm:p-3.5",
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">Recent articles</p>
          <p className="text-muted-foreground text-xs">
            Latest updates across your content
          </p>
        </div>
        <Link
          href="/articles"
          className="shrink-0 font-medium text-primary text-xs hover:underline"
        >
          View all
        </Link>
      </div>

      <DashboardScrollableBody empty={isEmpty}>
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="font-medium text-sm">No articles yet</p>
            <p className="mt-1 max-w-xs text-muted-foreground text-xs leading-relaxed">
              Create your first article to start building the company profile.
            </p>
            <Link
              href="/articles/new"
              className="mt-3 font-medium text-primary text-sm hover:underline"
            >
              Create article
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {articles.map((article) => {
              const updated = formatClientDateParts(article.updatedAt);

              return (
                <li key={article.id}>
                  <Link
                    href={`/articles/${article.id}/edit`}
                    className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-black/4 dark:hover:bg-white/6"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">
                        {article.title || "Untitled"}
                      </p>
                      <p className="truncate text-muted-foreground text-xs">
                        {STATUS_LABEL[article.status]} · {updated.date}
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
