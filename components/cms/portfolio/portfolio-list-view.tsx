"use client";

import { useEffect, useMemo } from "react";
import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
import { PortfolioListEmptyState } from "@/components/cms/portfolio/portfolio-list-empty-state";
import { PortfolioListToolbar } from "@/components/cms/portfolio/portfolio-list-toolbar";
import { PortfolioListWorkspace } from "@/components/cms/portfolio/portfolio-list-workspace";
import { CmsPageHeaderActions } from "@/components/shared/cms-page-header-actions";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { useListBulkSelection } from "@/hooks/use-list-bulk-selection";
import { usePortfolioList } from "@/hooks/use-portfolio-list";
import type { Client } from "@/types/client";
import type { Portfolio } from "@/types/portfolio";

interface PortfolioListViewProps {
  items: Portfolio[];
  clients: Client[];
}

export function PortfolioListView({ items, clients }: PortfolioListViewProps) {
  const clientNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const client of clients) {
      map.set(client.id, client.name);
    }
    return map;
  }, [clients]);

  const {
    workTypeFilter,
    setWorkTypeFilter,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedId,
    selectItem,
    closePanel,
    pagination,
    selectedItem,
    hasActiveFilters,
    resetFilters,
  } = usePortfolioList(items, clientNameById);

  const visibleIds = useMemo(
    () => pagination.items.map((item) => item.id),
    [pagination.items],
  );
  const bulk = useListBulkSelection(visibleIds);
  const bulkSelectedIdSet = useMemo(
    () => new Set(bulk.selectedIds),
    [bulk.selectedIds],
  );

  useEffect(() => {
    bulk.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clear on list identity change
  }, [workTypeFilter, search, sort, page, pageSize]);

  const headerActions = useMemo(() => {
    if (items.length === 0) {
      return <ClientsWorksNewDataButton />;
    }

    return (
      <PortfolioListToolbar
        search={search}
        workTypeFilter={workTypeFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onWorkTypeFilterChange={setWorkTypeFilter}
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
    setSort,
    setWorkTypeFilter,
    sort,
    workTypeFilter,
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CmsPageHeaderActions>{headerActions}</CmsPageHeaderActions>

      {items.length === 0 ? (
        <PortfolioListEmptyState />
      ) : (
        <PortfolioListWorkspace
          className={CMS_FLEX_CHILD}
          items={pagination.items}
          clientNameById={clientNameById}
          selectedItem={selectedItem}
          selectedId={selectedId}
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          totalPages={pagination.totalPages}
          rangeStart={pagination.rangeStart}
          rangeEnd={pagination.rangeEnd}
          sort={sort}
          bulkSelectedIds={bulk.selectedIds}
          bulkSelectedIdSet={bulkSelectedIdSet}
          isAllBulkSelected={bulk.isAllSelected}
          isBulkIndeterminate={bulk.isIndeterminate}
          onSelect={selectItem}
          onClosePanel={closePanel}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSortChange={setSort}
          onToggleBulk={bulk.toggle}
          onToggleBulkAll={(checked) => {
            if (checked) {
              bulk.selectAll();
            } else {
              bulk.clear();
            }
          }}
          onClearBulk={bulk.clear}
        />
      )}
    </div>
  );
}
