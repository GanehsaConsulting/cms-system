"use client";

import { useState } from "react";
import { MediaLibraryGrid } from "@/components/cms/media/media-library-grid";
import { MediaLibraryInUseDetailDialog } from "@/components/cms/media/media-library-in-use-detail-dialog";
import { MediaLibraryTable } from "@/components/cms/media/media-library-table";
import { MediaLibraryToolbar } from "@/components/cms/media/media-library-toolbar";
import { MediaLibraryTypeTabs } from "@/components/cms/media/media-library-type-tabs";
import { CmsListPagination } from "@/components/shared/cms-list-pagination";
import { GlassSurface } from "@/components/shared/glass-surface";
import { MEDIA_LIBRARY_IN_USE_PAGE_SIZE_OPTIONS } from "@/config/media-library";
import { useMediaLibraryList } from "@/hooks/use-media-library-list";
import { countMediaAssetsByKind } from "@/lib/media/list";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { MediaAsset } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryInUseViewProps {
  assets: MediaAsset[];
}

export function MediaLibraryInUseView({ assets: initialAssets }: MediaLibraryInUseViewProps) {
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const {
    assets,
    typeFilter,
    setTypeFilter,
    search,
    setSearch,
    viewMode,
    setViewMode,
    page,
    setPage,
    pageSize,
    setPageSize,
    pagination,
    hasActiveFilters,
    resetFilters,
    totalCount,
    filteredCount,
  } = useMediaLibraryList(initialAssets);

  const kindCounts = countMediaAssetsByKind(initialAssets);

  function handleAssetSelect(asset: MediaAsset) {
    setSelectedAsset(asset);
  }

  function handleDetailOpenChange(open: boolean) {
    if (!open) {
      setSelectedAsset(null);
    }
  }

  return (
    <>
      <GlassSurface className={cn("flex min-h-0 flex-col overflow-hidden", CMS_FLEX_CHILD)}>
        <div className="flex shrink-0 items-center justify-between gap-2 border-(--separator) border-b px-4 py-3">
          <div>
            <h2 className="font-semibold text-sm">In use across CMS</h2>
            <p className="text-muted-foreground text-xs">
              {filteredCount} of {totalCount} files · {kindCounts.image} images ·{" "}
              {kindCounts.video} videos · {kindCounts.document} documents
            </p>
          </div>
          <MediaLibraryToolbar
            search={search}
            viewMode={viewMode}
            onSearchChange={setSearch}
            onViewModeChange={setViewMode}
          />
        </div>

        <div className="shrink-0 border-(--separator) border-b px-4 py-3">
          <MediaLibraryTypeTabs value={typeFilter} onChange={setTypeFilter} />
        </div>

        {assets.length > 0 ? (
          <>
            <div className={CMS_SCROLL_REGION}>
              {viewMode === "grid" ? (
                <MediaLibraryGrid assets={assets} onAssetSelect={handleAssetSelect} />
              ) : (
                <MediaLibraryTable assets={assets} onAssetSelect={handleAssetSelect} />
              )}
            </div>
            <CmsListPagination
              page={page}
              pageSize={pageSize}
              total={pagination.total}
              totalPages={pagination.totalPages}
              rangeStart={pagination.rangeStart}
              rangeEnd={pagination.rangeEnd}
              itemLabel="files"
              pageSizeOptions={MEDIA_LIBRARY_IN_USE_PAGE_SIZE_OPTIONS}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <p className="font-medium text-sm">
              {totalCount === 0 ? "No media in use yet" : "No media found"}
            </p>
            <p className="mt-1 max-w-sm text-muted-foreground text-sm leading-relaxed">
              {totalCount === 0
                ? "Upload files in articles, banners, clients, or other modules to see them here."
                : "Try changing the type filter or search keywords."}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-primary text-sm hover:underline"
              >
                Reset filters
              </button>
            ) : null}
          </div>
        )}
      </GlassSurface>

      <MediaLibraryInUseDetailDialog
        asset={selectedAsset}
        open={selectedAsset !== null}
        onOpenChange={handleDetailOpenChange}
      />
    </>
  );
}
