"use client";

import { useMemo } from "react";
import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
import { ClientsWorksPageHeader } from "@/components/cms/clients/clients-works-page-header";
import { PortfolioListEmptyState } from "@/components/cms/portfolio/portfolio-list-empty-state";
import { PortfolioListToolbar } from "@/components/cms/portfolio/portfolio-list-toolbar";
import { PortfolioListWorkspace } from "@/components/cms/portfolio/portfolio-list-workspace";
import { CMS_FLEX_CHILD, SHELL_PADDING } from "@/config/spacing";
import { usePortfolioList } from "@/hooks/use-portfolio-list";
import type { Client } from "@/types/client";
import type { Portfolio } from "@/types/portfolio";
import { cn } from "@/lib/utils";

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

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SHELL_PADDING,
        )}
      >
        <ClientsWorksPageHeader
          description="Social media and website works linked to each client."
          actions={<ClientsWorksNewDataButton />}
        />
        <PortfolioListEmptyState />
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
        description="Social media and website works linked to each client."
        actions={
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
        }
      />

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
        onSelect={selectItem}
        onClosePanel={closePanel}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={setSort}
      />
    </div>
  );
}
