"use client";

import { ArticleListTableRow } from "@/components/cms/articles/article-list-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { CmsListTableSortHead } from "@/components/shared/cms-list-table-sort-head";
import { TableHead } from "@/components/ui/table";
import {
  ARTICLE_TABLE_SORT_MAP,
  type ArticleListSort,
} from "@/config/article-list";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { Article } from "@/types/article";

interface ArticleListTableProps {
  articles: Article[];
  selectedId: string | null;
  sort: ArticleListSort;
  onSelect: (id: string) => void;
  onSortChange: (sort: ArticleListSort) => void;
}

export function ArticleListTable({
  articles,
  selectedId,
  sort,
  onSelect,
  onSortChange,
}: ArticleListTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <CmsListTableSortHead
            label="Article"
            column="title"
            sort={sort}
            sortMap={ARTICLE_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Author"
            column="author"
            sort={sort}
            sortMap={ARTICLE_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Category"
            column="category"
            sort={sort}
            sortMap={ARTICLE_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Status"
            column="status"
            sort={sort}
            sortMap={ARTICLE_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Updated"
            column="updated"
            sort={sort}
            sortMap={ARTICLE_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={`${LIST_TABLE_HEAD_CLASS} w-12 text-right`}>
            Actions
          </TableHead>
        </>
      }
    >
      {articles.map((article) => (
        <ArticleListTableRow
          key={article.id}
          article={article}
          isSelected={selectedId === article.id}
          onSelect={onSelect}
        />
      ))}
    </CmsListTable>
  );
}
