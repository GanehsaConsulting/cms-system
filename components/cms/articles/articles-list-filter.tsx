"use client";

import { CmsListFilterPopover } from "@/components/shared/cms-list-filter-popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ARTICLE_LIST_SORT_OPTIONS,
  ARTICLE_STATUS_FILTERS,
  type ArticleListSort,
  type ArticleStatusFilter,
} from "@/config/article-list";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";
import { toSelectItems } from "@/lib/select-items";

interface ArticlesListFilterProps {
  statusFilter: ArticleStatusFilter;
  sort: ArticleListSort;
  hasActiveFilters: boolean;
  onStatusFilterChange: (filter: ArticleStatusFilter) => void;
  onSortChange: (sort: ArticleListSort) => void;
  onReset: () => void;
}

export function ArticlesListFilter({
  statusFilter,
  sort,
  hasActiveFilters,
  onStatusFilterChange,
  onSortChange,
  onReset,
}: ArticlesListFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="article-status-filter">Status</Label>
          <Select
            value={statusFilter}
            items={toSelectItems(ARTICLE_STATUS_FILTERS)}
            onValueChange={(value) =>
              onStatusFilterChange(value as ArticleStatusFilter)
            }
          >
            <SelectTrigger id="article-status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ARTICLE_STATUS_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="article-sort">Sort by</Label>
          <Select
            value={sort}
            items={toSelectItems(ARTICLE_LIST_SORT_OPTIONS)}
            onValueChange={(value) => onSortChange(value as ArticleListSort)}
          >
            <SelectTrigger id="article-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ARTICLE_LIST_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CmsListFilterPopover>
  );
}
