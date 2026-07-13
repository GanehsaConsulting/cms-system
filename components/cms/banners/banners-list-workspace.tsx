"use client";

import { BannerListTable } from "@/components/cms/banners/banner-list-table";
import { CmsListPagination } from "@/components/shared/cms-list-pagination";
import { GlassSurface } from "@/components/shared/glass-surface";
import type { BannerListSort } from "@/config/banner-list";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { Banner } from "@/types/banner";
import { cn } from "@/lib/utils";

interface BannersListWorkspaceProps {
  banners: Banner[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  sort: BannerListSort;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: BannerListSort) => void;
  onEdit: (banner: Banner) => void;
  className?: string;
}

export function BannersListWorkspace({
  banners,
  page,
  pageSize,
  total,
  totalPages,
  rangeStart,
  rangeEnd,
  sort,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onEdit,
  className,
}: BannersListWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 overflow-hidden",
        CMS_FLEX_CHILD,
        className,
      )}
    >
      <GlassSurface className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {banners.length > 0 ? (
          <>
            <div className={CMS_SCROLL_REGION}>
              <BannerListTable
                banners={banners}
                sort={sort}
                onSortChange={onSortChange}
                onEdit={onEdit}
              />
            </div>
            <CmsListPagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              itemLabel="banners"
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <p className="font-medium text-sm">No banners found</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Try changing filters or search keywords.
            </p>
          </div>
        )}
      </GlassSurface>
    </div>
  );
}
