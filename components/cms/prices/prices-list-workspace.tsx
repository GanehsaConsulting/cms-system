"use client";

import { PriceDetailPanel } from "@/components/cms/prices/price-detail-panel";
import { CmsListPagination } from "@/components/shared/cms-list-pagination";
import { PriceListTable } from "@/components/cms/prices/price-list-table";
import { GlassSurface } from "@/components/shared/glass-surface";
import type { PriceListSort } from "@/config/price-list";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { Price } from "@/types/price";
import { cn } from "@/lib/utils";

interface PricesListWorkspaceProps {
  prices: Price[];
  selectedPrice: Price | null;
  selectedId: string | null;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  sort: PriceListSort;
  onSelect: (id: string) => void;
  onClosePanel: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: PriceListSort) => void;
  className?: string;
}

export function PricesListWorkspace({
  prices,
  selectedPrice,
  selectedId,
  page,
  pageSize,
  total,
  totalPages,
  rangeStart,
  rangeEnd,
  sort,
  onSelect,
  onClosePanel,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  className,
}: PricesListWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 gap-3 overflow-hidden",
        CMS_FLEX_CHILD,
        className,
      )}
    >
      <GlassSurface className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {prices.length > 0 ? (
          <>
            <div className={CMS_SCROLL_REGION}>
              <PriceListTable
                prices={prices}
                selectedId={selectedId}
                sort={sort}
                onSelect={onSelect}
                onSortChange={onSortChange}
              />
            </div>
            <CmsListPagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              itemLabel="price plans"
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <p className="font-medium text-sm">No price plans found</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Try changing filters or search keywords.
            </p>
          </div>
        )}
      </GlassSurface>

      {selectedPrice ? (
        <GlassSurface className="hidden min-h-0 w-[24rem] shrink-0 flex-col overflow-hidden lg:flex">
          <PriceDetailPanel price={selectedPrice} onClose={onClosePanel} />
        </GlassSurface>
      ) : null}
    </div>
  );
}
