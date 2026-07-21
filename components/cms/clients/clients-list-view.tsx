"use client";

import { ClientsListEmptyState } from "@/components/cms/clients/clients-list-empty-state";
import { ClientsListToolbar } from "@/components/cms/clients/clients-list-toolbar";
import { ClientsListWorkspace } from "@/components/cms/clients/clients-list-workspace";
import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
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

  if (clients.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SECTION_BODY_PADDING,
        )}
      >
        <div className="mb-4 flex shrink-0 justify-end">
          <ClientsWorksNewDataButton />
        </div>
        <ClientsListEmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SECTION_BODY_PADDING,
      )}
    >
      <div className="mb-4 flex shrink-0 justify-end">
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
