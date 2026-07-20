"use client";

import { useState } from "react";
import { XIcon } from "@/lib/icons";
import { ArticleDetailPanelActions } from "@/components/cms/articles/article-detail-panel-actions";
import { ArticleDetailPanelTabs } from "@/components/cms/articles/article-detail-panel-tabs";
import { ArticleDetailTabDetail } from "@/components/cms/articles/article-detail-tab-detail";
import { ArticleDetailTabSeo } from "@/components/cms/articles/article-detail-tab-seo";
import { ArticleStatusBadge } from "@/components/cms/articles/article-status-badge";
import { ArticleThumbnail } from "@/components/cms/articles/article-thumbnail";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types/article";

export type ArticleDetailPanelTab = "detail" | "seo";

interface ArticleDetailPanelProps {
  article: Article;
  onClose: () => void;
}

export function ArticleDetailPanel({
  article,
  onClose,
}: ArticleDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<ArticleDetailPanelTab>("detail");

  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-[color:var(--separator)] border-b p-4">
        <div className="min-w-0 space-y-2">
          <h2 className="line-clamp-2 font-semibold text-sm leading-snug">
            {article.title}
          </h2>
          <ArticleStatusBadge status={article.status} />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="size-8 shrink-0"
          aria-label="Close panel"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <ArticleThumbnail
          articleId={article.id}
          title={article.title}
          src={article.thumbnail}
          size="md"
        />

        <ArticleDetailPanelTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "detail" ? (
          <ArticleDetailTabDetail article={article} />
        ) : null}
        {activeTab === "seo" ? <ArticleDetailTabSeo article={article} /> : null}
      </div>

      <ArticleDetailPanelActions article={article} />
    </aside>
  );
}
