"use client";

import { PricesListEmptyState } from "@/components/cms/prices/prices-list-empty-state";
import { PricesListHeader } from "@/components/cms/prices/prices-list-header";
import { PricesListToolbar } from "@/components/cms/prices/prices-list-toolbar";
import { PricesListWorkspace } from "@/components/cms/prices/prices-list-workspace";
import { usePricesList } from "@/hooks/use-prices-list";
import { CMS_FLEX_CHILD, SHELL_PADDING } from "@/config/spacing";
import type { Price } from "@/types/price";
import { cn } from "@/lib/utils";

interface PricesListViewProps {
  prices: Price[];
}

export function PricesListView({ prices }: PricesListViewProps) {
  const {
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedId,
    selectPrice,
    closePanel,
    services,
    pagination,
    selectedPrice,
    hasActiveFilters,
    resetFilters,
  } = usePricesList(prices);

  if (prices.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SHELL_PADDING,
        )}
      >
        <header className="mb-4 shrink-0">
          <PricesListHeader />
        </header>
        <PricesListEmptyState />
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
          <PricesListHeader />
          <PricesListToolbar
            search={search}
            statusFilter={statusFilter}
            serviceFilter={serviceFilter}
            services={services}
            sort={sort}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onServiceFilterChange={setServiceFilter}
            onSortChange={setSort}
            onResetFilters={resetFilters}
          />
        </div>
      </header>

      <PricesListWorkspace
        className={CMS_FLEX_CHILD}
        prices={pagination.items}
        selectedPrice={selectedPrice}
        selectedId={selectedId}
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        rangeStart={pagination.rangeStart}
        rangeEnd={pagination.rangeEnd}
        sort={sort}
        onSelect={selectPrice}
        onClosePanel={closePanel}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={setSort}
      />
    </div>
  );
}
