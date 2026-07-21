"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BannerFormDialog } from "@/components/cms/banners/banner-form-dialog";
import { BannersGlobalPanel } from "@/components/cms/banners/banners-global-panel";
import { BannersListToolbar } from "@/components/cms/banners/banners-list-toolbar";
import { BannersPlacementsSection } from "@/components/cms/banners/banners-placements-section";
import type { BannerPlacement } from "@/config/banner-placements";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { useBannersList } from "@/hooks/use-banners-list";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannersListViewProps {
  banners: Banner[];
}

export function BannersListView({ banners }: BannersListViewProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [defaultKey, setDefaultKey] = useState("");
  const [lockKey, setLockKey] = useState(false);

  const {
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    sort,
    setSort,
    filteredBanners,
    hasActiveFilters,
    resetFilters,
  } = useBannersList(banners);

  const bannersByKey = useMemo(() => {
    const map = new Map<string, Banner>();
    for (const banner of banners) {
      map.set(banner.key, banner);
    }
    return map;
  }, [banners]);

  function openCreate(options?: { key?: string; lockKey?: boolean }) {
    setEditingBanner(null);
    setDefaultKey(options?.key ?? "");
    setLockKey(Boolean(options?.lockKey));
    setFormOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditingBanner(banner);
    setDefaultKey("");
    setLockKey(false);
    setFormOpen(true);
  }

  function handleSelectPlacement(
    placement: BannerPlacement,
    banner: Banner | null,
  ) {
    if (banner) {
      openEdit(banner);
      return;
    }

    openCreate({ key: placement.key, lockKey: true });
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) {
      setEditingBanner(null);
      setDefaultKey("");
      setLockKey(false);
    }
  }

  function handleSaved() {
    router.refresh();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex shrink-0 justify-end">
        <BannersListToolbar
          search={search}
          statusFilter={statusFilter}
          sort={sort}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
          onSortChange={setSort}
          onResetFilters={resetFilters}
          onCreate={() => openCreate()}
        />
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex-row",
          CMS_FLEX_CHILD,
        )}
      >
        <BannersPlacementsSection
          bannersByKey={bannersByKey}
          onSelectPlacement={handleSelectPlacement}
        />

        <BannersGlobalPanel
          banners={filteredBanners}
          onEdit={openEdit}
          onAddPlacement={() => openCreate()}
        />
      </div>

      <BannerFormDialog
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        banner={editingBanner}
        defaultKey={defaultKey}
        lockKey={lockKey}
        onSaved={handleSaved}
      />
    </div>
  );
}
