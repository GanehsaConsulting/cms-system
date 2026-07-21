"use client";

import { ClientsListEmptyState } from "@/components/cms/clients/clients-list-empty-state";
import { ClientsListToolbar } from "@/components/cms/clients/clients-list-toolbar";
import { ClientsListWorkspace } from "@/components/cms/clients/clients-list-workspace";
import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
import { ClientsWorksPageHeader } from "@/components/cms/clients/clients-works-page-header";
import { useClientsList } from "@/hooks/use-clients-list";
import { CMS_FLEX_CHILD, SHELL_PADDING } from "@/config/spacing";
import type { Client } from "@/types/client";
import { cn } from "@/lib/utils";

interface ClientsListViewProps {
  clients: Client[];
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

const DEFAULT_DESCRIPTION =
  "Central source of truth for client logos, testimonials, and gallery assets.";

export function ClientsListView({
  clients,
  description = DEFAULT_DESCRIPTION,
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
          SHELL_PADDING,
        )}
      >
        <ClientsWorksPageHeader
          description={description}
          actions={<ClientsWorksNewDataButton />}
        />
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
        SHELL_PADDING,
      )}
    >
      <ClientsWorksPageHeader
        description={description}
        actions={
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
        }
      />

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
