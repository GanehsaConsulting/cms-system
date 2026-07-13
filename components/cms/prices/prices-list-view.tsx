"use client";

import { useEffect, useState } from "react";
import { PriceCategoriesManageDialog } from "@/components/cms/prices/price-categories-manage-dialog";
import { PricesListEmptyState } from "@/components/cms/prices/prices-list-empty-state";
import { PricesListHeader } from "@/components/cms/prices/prices-list-header";
import { PricesListManageCategoriesButton } from "@/components/cms/prices/prices-list-manage-categories-button";
import { PricesListCreateButton } from "@/components/cms/prices/prices-list-create-button";
import { PricesListToolbar } from "@/components/cms/prices/prices-list-toolbar";
import { PricesListWorkspace } from "@/components/cms/prices/prices-list-workspace";
import { usePricesList } from "@/hooks/use-prices-list";
import { CMS_FLEX_CHILD, SHELL_PADDING } from "@/config/spacing";
import type { Price } from "@/types/price";
import type { PriceCategory } from "@/types/price-category";
import { cn } from "@/lib/utils";

interface PricesListViewProps {
  prices: Price[];
  categories: PriceCategory[];
}

export function PricesListView({ prices, categories }: PricesListViewProps) {
  const [availableCategories, setAvailableCategories] =
    useState<PriceCategory[]>(categories);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    setAvailableCategories(categories);
  }, [categories]);

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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <PricesListHeader />
            <div className="flex flex-wrap items-center gap-2">
              <PricesListManageCategoriesButton
                onClick={() => setCategoriesOpen(true)}
              />
              <PricesListCreateButton />
            </div>
          </div>
        </header>
        <PricesListEmptyState />
        <PriceCategoriesManageDialog
          open={categoriesOpen}
          onOpenChange={setCategoriesOpen}
          categories={availableCategories}
          onCategoriesChange={setAvailableCategories}
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
      <header className="mb-4 shrink-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <PricesListHeader />
          <PricesListToolbar
            search={search}
            statusFilter={statusFilter}
            serviceFilter={serviceFilter}
            services={services}
            categories={availableCategories}
            sort={sort}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onServiceFilterChange={setServiceFilter}
            onSortChange={setSort}
            onResetFilters={resetFilters}
            onManageCategories={() => setCategoriesOpen(true)}
          />
        </div>
      </header>

      <PricesListWorkspace
        className={CMS_FLEX_CHILD}
        prices={pagination.items}
        categories={availableCategories}
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

      <PriceCategoriesManageDialog
        open={categoriesOpen}
        onOpenChange={setCategoriesOpen}
        categories={availableCategories}
        onCategoriesChange={setAvailableCategories}
      />
    </div>
  );
}
