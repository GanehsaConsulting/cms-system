"use client";

import { ArticleAuthorCell } from "@/components/cms/articles/article-author-cell";
import { ArticleCategoryBadge } from "@/components/cms/articles/article-category-badge";
import { ArticleRowActionsMenu } from "@/components/cms/articles/article-row-actions-menu";
import { ArticleStatusBadge } from "@/components/cms/articles/article-status-badge";
import { ArticleThumbnail } from "@/components/cms/articles/article-thumbnail";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import { formatArticleDateParts } from "@/lib/articles/list";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/article";

interface ArticleListTableRowProps {
  article: Article;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ArticleListTableRow({
  article,
  isSelected,
  onSelect,
}: ArticleListTableRowProps) {
  const updated = formatArticleDateParts(article.updatedAt);
  const scheduled =
    article.status === "scheduled" && article.publishedAt
      ? formatArticleDateParts(article.publishedAt)
      : null;

  return (
    <CmsListTableRow
      isSelected={isSelected}
      onClick={() => onSelect(article.id)}
    >
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="flex min-w-[260px] items-center gap-3">
          <ArticleThumbnail articleId={article.id} title={article.title} />
          <div className="min-w-0">
            <p className="truncate font-medium">{article.title}</p>
            <p className="truncate text-muted-foreground text-xs">
              /{article.slug}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <ArticleAuthorCell name={article.authorName} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <ArticleCategoryBadge categoryId={article.category} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="space-y-1">
          <ArticleStatusBadge status={article.status} />
          {scheduled ? (
            <p className="text-muted-foreground text-xs">
              {scheduled.date} {scheduled.time}
            </p>
          ) : null}
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="text-sm leading-tight">
          <p>{updated.date}</p>
          <p className="text-muted-foreground text-xs">{updated.time}</p>
        </div>
      </TableCell>
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        <ArticleRowActionsMenu article={article} />
      </TableCell>
    </CmsListTableRow>
  );
}
