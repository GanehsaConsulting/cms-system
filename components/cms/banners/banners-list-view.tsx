"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BannerFormDialog } from "@/components/cms/banners/banner-form-dialog";
import { BannersListCreateButton } from "@/components/cms/banners/banners-list-create-button";
import { BannersListEmptyState } from "@/components/cms/banners/banners-list-empty-state";
import { BannersListHeader } from "@/components/cms/banners/banners-list-header";
import { BannersListToolbar } from "@/components/cms/banners/banners-list-toolbar";
import { BannersListWorkspace } from "@/components/cms/banners/banners-list-workspace";
import { useBannersList } from "@/hooks/use-banners-list";
import { CMS_FLEX_CHILD, SHELL_PADDING } from "@/config/spacing";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannersListViewProps {
  banners: Banner[];
}

export function BannersListView({ banners }: BannersListViewProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const {
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    pagination,
    hasActiveFilters,
    resetFilters,
  } = useBannersList(banners);

  function openCreate() {
    setEditingBanner(null);
    setFormOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditingBanner(banner);
    setFormOpen(true);
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) {
      setEditingBanner(null);
    }
  }

  function handleSaved() {
    router.refresh();
  }

  if (banners.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SHELL_PADDING,
        )}
      >
        <header className="mb-4 shrink-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <BannersListHeader />
            <BannersListCreateButton onClick={openCreate} />
          </div>
        </header>
        <BannersListEmptyState />
        <BannerFormDialog
          open={formOpen}
          onOpenChange={handleFormOpenChange}
          banner={editingBanner}
          onSaved={handleSaved}
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
          <BannersListHeader />
          <BannersListToolbar
            search={search}
            statusFilter={statusFilter}
            sort={sort}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onSortChange={setSort}
            onResetFilters={resetFilters}
            onCreate={openCreate}
          />
        </div>
      </header>

      <BannersListWorkspace
        className={CMS_FLEX_CHILD}
        banners={pagination.items}
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        rangeStart={pagination.rangeStart}
        rangeEnd={pagination.rangeEnd}
        sort={sort}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortChange={setSort}
        onEdit={openEdit}
      />

      <BannerFormDialog
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        banner={editingBanner}
        onSaved={handleSaved}
      />
    </div>
  );
}
