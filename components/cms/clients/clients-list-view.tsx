"use client";

import { useEffect, useMemo } from "react";
import { ClientsListEmptyState } from "@/components/cms/clients/clients-list-empty-state";
import { ClientsListToolbar } from "@/components/cms/clients/clients-list-toolbar";
import { ClientsListWorkspace } from "@/components/cms/clients/clients-list-workspace";
import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
import { CmsPageHeaderActions } from "@/components/shared/cms-page-header-actions";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { useClientsList } from "@/hooks/use-clients-list";
import { useListBulkSelection } from "@/hooks/use-list-bulk-selection";
import type { ClientListPreviewMode } from "@/lib/clients/preview";
import type { Client } from "@/types/client";

interface ClientsListViewProps {
  clients: Client[];
  previewMode?: ClientListPreviewMode;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ClientsListView({
  clients,
  previewMode = "auto",
  emptyTitle,
  emptyDescription,
}: ClientsListViewProps) {
  const {
    featuredFilter,
    setFeaturedFilter,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedId,
    selectClient,
    closePanel,
    pagination,
    selectedClient,
    hasActiveFilters,
    resetFilters,
  } = useClientsList(clients);

  const visibleIds = useMemo(
    () => pagination.items.map((client) => client.id),
    [pagination.items],
  );
  const bulk = useListBulkSelection(visibleIds);
  const bulkSelectedIdSet = useMemo(
    () => new Set(bulk.selectedIds),
    [bulk.selectedIds],
  );

  useEffect(() => {
    bulk.clear();
    // Clear when the visible page/filter set changes — not on every bulk API change.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: clear on list identity change
  }, [featuredFilter, search, sort, page, pageSize]);

  const headerActions = useMemo(() => {
    if (clients.length === 0) {
      return <ClientsWorksNewDataButton />;
    }

    return (
      <ClientsListToolbar
        search={search}
        featuredFilter={featuredFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onFeaturedFilterChange={setFeaturedFilter}
        onSortChange={setSort}
        onResetFilters={resetFilters}
      />
    );
  }, [
    clients.length,
    featuredFilter,
    hasActiveFilters,
    resetFilters,
    search,
    setFeaturedFilter,
    setSearch,
    setSort,
    sort,
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CmsPageHeaderActions>{headerActions}</CmsPageHeaderActions>

      {clients.length === 0 ? (
        <ClientsListEmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <ClientsListWorkspace
          className={CMS_FLEX_CHILD}
          clients={pagination.items}
          selectedClient={selectedClient}
          selectedId={selectedId}
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          totalPages={pagination.totalPages}
          rangeStart={pagination.rangeStart}
          rangeEnd={pagination.rangeEnd}
          sort={sort}
          previewMode={previewMode}
          bulkSelectedIds={bulk.selectedIds}
          bulkSelectedIdSet={bulkSelectedIdSet}
          isAllBulkSelected={bulk.isAllSelected}
          isBulkIndeterminate={bulk.isIndeterminate}
          onSelect={selectClient}
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
