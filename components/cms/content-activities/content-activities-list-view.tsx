"use client";

import { useMemo } from "react";
import { ContentActivitiesListEmptyState } from "@/components/cms/content-activities/content-activities-list-empty-state";
import { ContentActivitiesListCreateButton } from "@/components/cms/content-activities/content-activities-list-create-button";
import { ContentActivitiesListKindTabs } from "@/components/cms/content-activities/content-activities-list-kind-tabs";
import { ContentActivitiesListToolbar } from "@/components/cms/content-activities/content-activities-list-toolbar";
import { ContentActivitiesListWorkspace } from "@/components/cms/content-activities/content-activities-list-workspace";
import {
  CmsPageHeaderActions,
  CmsPageHeaderSubnav,
} from "@/components/shared/cms-page-header-actions";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { useContentActivitiesList } from "@/hooks/use-content-activities-list";
import type { ContentActivity } from "@/types/content-activity";

interface ContentActivitiesListViewProps {
  items: ContentActivity[];
}

export function ContentActivitiesListView({
  items,
}: ContentActivitiesListViewProps) {
  const {
    kindFilter,
    setKindFilter,
    kindCounts,
    statusFilter,
    setStatusFilter,
    showTitleFilter,
    setShowTitleFilter,
    search,
    setSearch,
    sort,
    setSort,
    setPage,
    setPageSize,
    selectedId,
    selectItem,
    closePanel,
    pagination,
    selectedItem,
    hasActiveFilters,
    resetFilters,
  } = useContentActivitiesList(items);

  const headerActions = useMemo(() => {
    if (items.length === 0) {
      return <ContentActivitiesListCreateButton />;
    }

    return (
      <ContentActivitiesListToolbar
        search={search}
        statusFilter={statusFilter}
        showTitleFilter={showTitleFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onShowTitleFilterChange={setShowTitleFilter}
        onSortChange={setSort}
        onResetFilters={resetFilters}
      />
    );
  }, [
    hasActiveFilters,
    items.length,
    resetFilters,
    search,
    setSearch,
    setShowTitleFilter,
    setSort,
    setStatusFilter,
    showTitleFilter,
    sort,
    statusFilter,
  ]);

  const headerSubnav = useMemo(() => {
    if (items.length === 0) {
      return null;
    }

    return (
      <ContentActivitiesListKindTabs
        value={kindFilter}
        counts={kindCounts}
        onChange={setKindFilter}
      />
    );
  }, [items.length, kindCounts, kindFilter, setKindFilter]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CmsPageHeaderActions>{headerActions}</CmsPageHeaderActions>
      {headerSubnav ? (
        <CmsPageHeaderSubnav>{headerSubnav}</CmsPageHeaderSubnav>
      ) : null}

      {items.length === 0 ? (
        <ContentActivitiesListEmptyState />
      ) : (
        <ContentActivitiesListWorkspace
          className={CMS_FLEX_CHILD}
          items={pagination.items}
          selectedItem={selectedItem}
          selectedId={selectedId}
          kindFilter={kindFilter}
          hasActiveFilters={hasActiveFilters}
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          totalPages={pagination.totalPages}
          rangeStart={pagination.rangeStart}
          rangeEnd={pagination.rangeEnd}
          sort={sort}
          onSelect={selectItem}
          onClosePanel={closePanel}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSortChange={setSort}
          onResetFilters={resetFilters}
        />
      )}
    </div>
  );
}
