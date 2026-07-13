"use client";

import { ClientsListCreateButton } from "@/components/cms/clients/clients-list-create-button";
import { ClientsListEmptyState } from "@/components/cms/clients/clients-list-empty-state";
import { ClientsListHeader } from "@/components/cms/clients/clients-list-header";
import { ClientsListToolbar } from "@/components/cms/clients/clients-list-toolbar";
import { ClientsListWorkspace } from "@/components/cms/clients/clients-list-workspace";
import { useClientsList } from "@/hooks/use-clients-list";
import { CMS_FLEX_CHILD, SHELL_PADDING } from "@/config/spacing";
import type { Client } from "@/types/client";
import { cn } from "@/lib/utils";

interface ClientsListViewProps {
  clients: Client[];
}

export function ClientsListView({ clients }: ClientsListViewProps) {
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

  if (clients.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SHELL_PADDING,
        )}
      >
        <header className="mb-4 shrink-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <ClientsListHeader />
            <ClientsListCreateButton />
          </div>
        </header>
        <ClientsListEmptyState />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SHELL_PADDING,
      )}
    >
      <header className="mb-4 shrink-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <ClientsListHeader />
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
        </div>
      </header>

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
    </div>
  );
}
