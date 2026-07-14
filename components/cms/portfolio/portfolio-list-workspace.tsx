"use client";

import { PortfolioDetailPanel } from "@/components/cms/portfolio/portfolio-detail-panel";
import { PortfolioListTable } from "@/components/cms/portfolio/portfolio-list-table";
import { CmsListPagination } from "@/components/shared/cms-list-pagination";
import { GlassSurface } from "@/components/shared/glass-surface";
import type { PortfolioListSort } from "@/config/portfolio-list";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { Portfolio } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface PortfolioListWorkspaceProps {
  items: Portfolio[];
  clientNameById: Map<string, string>;
  selectedItem: Portfolio | null;
  selectedId: string | null;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  sort: PortfolioListSort;
  onSelect: (id: string) => void;
  onClosePanel: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: PortfolioListSort) => void;
  className?: string;
}

export function PortfolioListWorkspace({
  items,
  clientNameById,
  selectedItem,
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
}: PortfolioListWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 gap-3 overflow-hidden",
        CMS_FLEX_CHILD,
        className,
      )}
    >
      <GlassSurface className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {items.length > 0 ? (
          <>
            <div className={CMS_SCROLL_REGION}>
              <PortfolioListTable
                items={items}
                clientNameById={clientNameById}
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
              itemLabel="works"
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <p className="font-medium text-sm">No works found</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Try changing filters or search keywords.
            </p>
          </div>
        )}
      </GlassSurface>

      {selectedItem ? (
        <GlassSurface className="hidden min-h-0 w-[24rem] shrink-0 flex-col overflow-hidden lg:flex">
          <PortfolioDetailPanel
            item={selectedItem}
            clientName={clientNameById.get(selectedItem.clientId) ?? ""}
            onClose={onClosePanel}
          />
        </GlassSurface>
      ) : null}
    </div>
  );
}
