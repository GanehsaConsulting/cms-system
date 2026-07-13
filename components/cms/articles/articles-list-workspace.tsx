"use client";

import { ArticleDetailPanel } from "@/components/cms/articles/article-detail-panel";
import { CmsListPagination } from "@/components/shared/cms-list-pagination";
import { ArticleListTable } from "@/components/cms/articles/article-list-table";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { ArticleListSort } from "@/config/article-list";
import type { Article } from "@/types/article";
import { cn } from "@/lib/utils";

interface ArticlesListWorkspaceProps {
  articles: Article[];
  selectedArticle: Article | null;
  selectedId: string | null;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  sort: ArticleListSort;
  onSelect: (id: string) => void;
  onClosePanel: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: ArticleListSort) => void;
  className?: string;
}

export function ArticlesListWorkspace({
  articles,
  selectedArticle,
  selectedId,
  page,
  pageSize,
  total,
  totalPages,
  rangeStart,
  rangeEnd,
  sort,
  onSelect,
  onClosePanel,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  className,
}: ArticlesListWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 gap-3 overflow-hidden",
        CMS_FLEX_CHILD,
        className,
      )}
    >
      <GlassSurface className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {articles.length > 0 ? (
          <>
            <div className={CMS_SCROLL_REGION}>
              <ArticleListTable
                articles={articles}
                selectedId={selectedId}
                sort={sort}
                onSelect={onSelect}
                onSortChange={onSortChange}
              />
            </div>
            <CmsListPagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              itemLabel="articles"
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <p className="font-medium text-sm">No articles found</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Try changing filters or search keywords.
            </p>
          </div>
        )}
      </GlassSurface>

      {selectedArticle ? (
        <GlassSurface className="hidden min-h-0 w-[24rem] shrink-0 flex-col overflow-hidden lg:flex">
          <ArticleDetailPanel
            article={selectedArticle}
            onClose={onClosePanel}
          />
        </GlassSurface>
      ) : null}
    </div>
  );
}
