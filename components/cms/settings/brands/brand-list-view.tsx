"use client";

import { useEffect, useMemo, useState } from "react";
import { BrandFormDialog } from "@/components/cms/settings/brands/brand-form-dialog";
import { BrandListEmptyState } from "@/components/cms/settings/brands/brand-list-empty-state";
import { BrandListGrid } from "@/components/cms/settings/brands/brand-list-grid";
import { BrandListToolbar } from "@/components/cms/settings/brands/brand-list-toolbar";
import { CmsPageHeaderActions } from "@/components/shared/cms-page-header-actions";
import { GlassSurface } from "@/components/shared/glass-surface";
import {
  CMS_FLEX_CHILD,
  CMS_SCROLL_REGION,
  SECTION_BODY_PADDING,
} from "@/config/spacing";
import { useBrandList } from "@/hooks/use-brand-list";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types/brand";

interface BrandListViewProps {
  brands: Brand[];
}

export function BrandListView({ brands: initialBrands }: BrandListViewProps) {
  const [brands, setBrands] = useState(initialBrands);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const {
    brands: visibleBrands,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    sort,
    setSort,
    hasActiveFilters,
    resetFilters,
    filteredCount,
  } = useBrandList(brands);

  useEffect(() => {
    setBrands(initialBrands);
  }, [initialBrands]);

  function openCreate() {
    setEditingBrand(null);
    setDialogOpen(true);
  }

  function openEdit(brand: Brand) {
    setEditingBrand(brand);
    setDialogOpen(true);
  }

  function handleSaved(brand: Brand) {
    setBrands((current) => {
      const index = current.findIndex((item) => item.id === brand.id);
      if (index === -1) {
        return [brand, ...current];
      }

      const next = [...current];
      next[index] = brand;
      return next;
    });
  }

  const headerActions = useMemo(
    () => (
      <BrandListToolbar
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
    ),
    [
      hasActiveFilters,
      resetFilters,
      search,
      setSearch,
      setSort,
      setStatusFilter,
      sort,
      statusFilter,
    ],
  );

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SECTION_BODY_PADDING,
      )}
    >
      <CmsPageHeaderActions>{headerActions}</CmsPageHeaderActions>

      {brands.length === 0 ? (
        <BrandListEmptyState onCreate={openCreate} />
      ) : (
        <GlassSurface
          className={cn(
            "flex min-h-0 flex-col overflow-hidden",
            CMS_FLEX_CHILD,
          )}
        >
          <div className="flex shrink-0 items-center justify-between gap-2 border-(--separator) border-b px-4 py-3">
            <div>
              <h2 className="font-semibold text-sm">Registered brands</h2>
              <p className="text-muted-foreground text-xs">
                {filteredCount} of {brands.length} brand
                {brands.length === 1 ? "" : "s"} · configure modules per brand
              </p>
            </div>
          </div>

          {visibleBrands.length > 0 ? (
            <div className={CMS_SCROLL_REGION}>
              <BrandListGrid brands={visibleBrands} onEdit={openEdit} />
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
              <p className="font-medium text-sm">No brands found</p>
              <p className="mt-1 text-muted-foreground text-sm">
                Try changing filters or search keywords.
              </p>
            </div>
          )}
        </GlassSurface>
      )}

      <BrandFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        brand={editingBrand}
        onSaved={handleSaved}
      />
    </div>
  );
}
