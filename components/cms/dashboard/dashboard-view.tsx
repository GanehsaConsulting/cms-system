"use client";

import { DashboardArticlesFocusWidget } from "@/components/cms/dashboard/dashboard-articles-focus-widget";
import { DashboardContentHealthWidget } from "@/components/cms/dashboard/dashboard-content-health-widget";
import { DashboardDraftsAttentionWidget } from "@/components/cms/dashboard/dashboard-drafts-attention-widget";
import { DashboardEditWidgetsButton } from "@/components/cms/dashboard/dashboard-edit-widgets-button";
import { DashboardEditWidgetsDialog } from "@/components/cms/dashboard/dashboard-edit-widgets-dialog";
import { DashboardGreeting } from "@/components/cms/dashboard/dashboard-greeting";
import { DashboardQuickActions } from "@/components/cms/dashboard/dashboard-quick-actions";
import { DashboardRecentArticlesWidget } from "@/components/cms/dashboard/dashboard-recent-articles-widget";
import { DashboardRecentWidget } from "@/components/cms/dashboard/dashboard-recent-widget";
import { DashboardShortcutsWidget } from "@/components/cms/dashboard/dashboard-shortcuts-widget";
import { DashboardStatWidget } from "@/components/cms/dashboard/dashboard-stat-widget";
import {
  DASHBOARD_DRAFTS_ATTENTION_LIMIT,
  DASHBOARD_RECENT_ACTIVITY_LIMIT,
  DASHBOARD_RECENT_ARTICLES_LIMIT,
  DASHBOARD_WIDGET_GAP,
  DASHBOARD_WIDGET_INSET,
} from "@/config/dashboard";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { useDashboardWidgets } from "@/hooks/use-dashboard-widgets";
import { getDraftsNeedingAttention } from "@/lib/dashboard/drafts";
import { buildDashboardRecentItems } from "@/lib/dashboard/recent";
import { FileTextIcon } from "@/lib/icons";
import type { Article } from "@/types/article";
import type { Banner } from "@/types/banner";
import type { Client } from "@/types/client";
import type { Price } from "@/types/price";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  articles: Article[];
  clients: Client[];
  prices: Price[];
  banners: Banner[];
  mediaFilesCount: number;
}

export function DashboardView({
  articles,
  clients,
  prices,
  banners,
  mediaFilesCount,
}: DashboardViewProps) {
  const {
    visibility,
    editOpen,
    setEditOpen,
    isVisible,
    setWidgetVisible,
    resetWidgets,
  } = useDashboardWidgets();

  const publishedCount = articles.filter(
    (article) => article.status === "published",
  ).length;
  const draftCount = articles.filter(
    (article) => article.status === "draft",
  ).length;
  const inactivePricesCount = prices.filter((price) => !price.isActive).length;
  const inactiveBannersCount = banners.filter(
    (banner) => !banner.isActive,
  ).length;
  const recentArticles = articles.slice(0, DASHBOARD_RECENT_ARTICLES_LIMIT);
  const attentionDrafts = getDraftsNeedingAttention(
    articles,
    DASHBOARD_DRAFTS_ATTENTION_LIMIT,
  );
  const recentItems = buildDashboardRecentItems({
    articles,
    clients,
    prices,
    banners,
    limit: DASHBOARD_RECENT_ACTIVITY_LIMIT,
  });

  const showGreeting = isVisible("greeting");
  const showQuickActions = isVisible("quick-actions");
  const showContentHealth = isVisible("content-health");
  const showArticleStats = isVisible("article-stats");
  const showRecentArticles = isVisible("recent-articles");
  const showDraftsAttention = isVisible("drafts-attention");
  const showRecentActivity = isVisible("recent-activity");
  const showArticlesFocus = isVisible("articles-focus");
  const showBrowse = isVisible("browse");

  const hasBentoGrid =
    showArticleStats ||
    showRecentArticles ||
    showDraftsAttention ||
    showRecentActivity ||
    showArticlesFocus ||
    showBrowse;

  return (
    <div className={cn(CMS_FLEX_CHILD, "overflow-y-auto")}>
      <div
        className={cn(
          "flex w-full flex-col",
          DASHBOARD_WIDGET_GAP,
          DASHBOARD_WIDGET_INSET,
        )}
      >
        {showGreeting ? <DashboardGreeting /> : null}
        {showQuickActions ? <DashboardQuickActions /> : null}
        {showContentHealth ? (
          <DashboardContentHealthWidget
            clientsCount={clients.length}
            pricesCount={prices.length}
            inactivePricesCount={inactivePricesCount}
            bannersCount={banners.length}
            inactiveBannersCount={inactiveBannersCount}
            mediaFilesCount={mediaFilesCount}
          />
        ) : null}

        {hasBentoGrid ? (
          <div
            className={cn(
              "grid grid-cols-2 auto-rows-auto items-stretch lg:grid-cols-6",
              DASHBOARD_WIDGET_GAP,
            )}
          >
            {showArticleStats ? (
              <>
                <DashboardStatWidget
                  label="Total articles"
                  value={articles.length}
                  description="All content"
                  icon={FileTextIcon}
                  variant="tinted"
                  className="col-span-2"
                />
                <DashboardStatWidget
                  label="Published"
                  value={publishedCount}
                  description="Live on site"
                  icon={FileTextIcon}
                  variant="glass"
                  className="col-span-1 lg:col-span-2"
                />
                <DashboardStatWidget
                  label="Drafts"
                  value={draftCount}
                  description="In progress"
                  icon={FileTextIcon}
                  variant="solid"
                  className="col-span-1 lg:col-span-2"
                />
              </>
            ) : null}

            {showRecentArticles ? (
              <DashboardRecentArticlesWidget
                articles={recentArticles}
                className={cn(
                  "col-span-2",
                  showDraftsAttention ? "lg:col-span-3" : "lg:col-span-6",
                )}
              />
            ) : null}
            {showDraftsAttention ? (
              <DashboardDraftsAttentionWidget
                drafts={attentionDrafts}
                className={cn(
                  "col-span-2",
                  showRecentArticles ? "lg:col-span-3" : "lg:col-span-6",
                )}
              />
            ) : null}

            {showRecentActivity ? (
              <DashboardRecentWidget
                items={recentItems}
                className={cn(
                  "col-span-2",
                  showArticlesFocus ? "lg:col-span-3" : "lg:col-span-6",
                )}
              />
            ) : null}
            {showArticlesFocus ? (
              <DashboardArticlesFocusWidget
                total={articles.length}
                published={publishedCount}
                drafts={draftCount}
                className={cn(
                  "col-span-2",
                  showRecentActivity ? "lg:col-span-3" : "lg:col-span-6",
                )}
              />
            ) : null}

            {showBrowse ? (
              <DashboardShortcutsWidget className="col-span-2 lg:col-span-6" />
            ) : null}
          </div>
        ) : null}

        <DashboardEditWidgetsButton onClick={() => setEditOpen(true)} />
        <DashboardEditWidgetsDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          visibility={visibility}
          onToggle={setWidgetVisible}
          onReset={resetWidgets}
        />
      </div>
    </div>
  );
}
