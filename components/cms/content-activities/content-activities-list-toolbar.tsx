"use client";

import { ContentActivitiesListCreateButton } from "@/components/cms/content-activities/content-activities-list-create-button";
import { ContentActivitiesListFilter } from "@/components/cms/content-activities/content-activities-list-filter";
import { ContentActivitiesListSearch } from "@/components/cms/content-activities/content-activities-list-search";
import type {
  ContentActivitiesListSort,
  ContentActivityShowTitleFilter,
  ContentActivityStatusFilter,
} from "@/config/content-activities-list";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";

interface ContentActivitiesListToolbarProps {
  search: string;
  statusFilter: ContentActivityStatusFilter;
  showTitleFilter: ContentActivityShowTitleFilter;
  sort: ContentActivitiesListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: ContentActivityStatusFilter) => void;
  onShowTitleFilterChange: (filter: ContentActivityShowTitleFilter) => void;
  onSortChange: (sort: ContentActivitiesListSort) => void;
  onResetFilters: () => void;
}

export function ContentActivitiesListToolbar({
  search,
  statusFilter,
  showTitleFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onStatusFilterChange,
  onShowTitleFilterChange,
  onSortChange,
  onResetFilters,
}: ContentActivitiesListToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <ContentActivitiesListFilter
        statusFilter={statusFilter}
        showTitleFilter={showTitleFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onStatusFilterChange={onStatusFilterChange}
        onShowTitleFilterChange={onShowTitleFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <ContentActivitiesListSearch value={search} onChange={onSearchChange} />
      <ContentActivitiesListCreateButton />
    </div>
  );
}
