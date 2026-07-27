"use client";

import { useMemo } from "react";
import { ClientsListCreateButton } from "@/components/cms/clients/clients-list-create-button";
import { ClientsWorksAllToolbar } from "@/components/cms/clients/clients-works-all-toolbar";
import { ClientsWorksAllWorkspace } from "@/components/cms/clients/clients-works-all-workspace";
import { ClientsWorksNewDataButton } from "@/components/cms/clients/clients-works-new-data-button";
import { CmsPageHeaderActions } from "@/components/shared/cms-page-header-actions";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { useClientsWorksAllList } from "@/hooks/use-clients-works-all-list";
import type { Client } from "@/types/client";
import type { Portfolio } from "@/types/portfolio";

interface ClientsWorksAllViewProps {
  clients: Client[];
  portfolio: Portfolio[];
}

export function ClientsWorksAllView({
  clients,
  portfolio,
}: ClientsWorksAllViewProps) {
  const {
    allGroups,
    featuredFilter,
    setFeaturedFilter,
    contentFilter,
    setContentFilter,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedId,
    selectedGroup,
    selectClient,
    closePanel,
    hasActiveFilters,
    resetFilters,
    pagination,
    clientCount,
    withWorksCount,
    portfolioCount,
  } = useClientsWorksAllList(clients, portfolio);

  const headerActions = useMemo(() => {
    if (allGroups.length === 0) {
      return <ClientsWorksNewDataButton />;
    }

    return (
      <ClientsWorksAllToolbar
        search={search}
        featuredFilter={featuredFilter}
        contentFilter={contentFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onFeaturedFilterChange={setFeaturedFilter}
        onContentFilterChange={setContentFilter}
        onSortChange={setSort}
        onResetFilters={resetFilters}
      />
    );
  }, [
    allGroups.length,
    contentFilter,
    featuredFilter,
    hasActiveFilters,
    resetFilters,
    search,
    setContentFilter,
    setFeaturedFilter,
    setSearch,
    setSort,
    sort,
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CmsPageHeaderActions>{headerActions}</CmsPageHeaderActions>

      {allGroups.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
          <p className="font-medium text-sm">No clients yet</p>
          <p className="mt-1 max-w-sm text-muted-foreground text-sm leading-relaxed">
            Create a client first, then attach social media or website works
            under them.
          </p>
          <div className="mt-4">
            <ClientsListCreateButton />
          </div>
        </div>
      ) : (
        <ClientsWorksAllWorkspace
          className={CMS_FLEX_CHILD}
          groups={pagination.items}
          selectedId={selectedId}
          selectedGroup={selectedGroup}
          sort={sort}
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          totalPages={pagination.totalPages}
          rangeStart={pagination.rangeStart}
          rangeEnd={pagination.rangeEnd}
          clientCount={clientCount}
          withWorksCount={withWorksCount}
          portfolioCount={portfolioCount}
          hasActiveFilters={hasActiveFilters}
          onSelect={selectClient}
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
