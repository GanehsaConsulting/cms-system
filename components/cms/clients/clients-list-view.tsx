"use client";

import { useMemo } from "react";
import { ClientsListEmptyState } from "@/components/cms/clients/clients-list-empty-state";
import { ClientsListToolbar } from "@/components/cms/clients/clients-list-toolbar";
import { ClientsListWorkspace } from "@/components/cms/clients/clients-list-workspace";
import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
import { CmsPageHeaderActions } from "@/components/shared/cms-page-header-actions";
import { CMS_FLEX_CHILD, SECTION_BODY_PADDING } from "@/config/spacing";
import { useClientsList } from "@/hooks/use-clients-list";
import { cn } from "@/lib/utils";
import type { Client } from "@/types/client";

interface ClientsListViewProps {
  clients: Client[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ClientsListView({
  clients,
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
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SECTION_BODY_PADDING,
      )}
    >
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
          onSelect={selectClient}
          onClosePanel={closePanel}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSortChange={setSort}
        />
      )}
    </div>
  );
}
