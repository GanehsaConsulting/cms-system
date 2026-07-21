"use client";

import { ClientsWorksAllDetailPanel } from "@/components/cms/clients/clients-works-all-detail-panel";
import { ClientsWorksAllTable } from "@/components/cms/clients/clients-works-all-table";
import { CmsListPagination } from "@/components/shared/cms-list-pagination";
import { GlassSurface } from "@/components/shared/glass-surface";
import type { ClientsWorksAllListSort } from "@/config/clients-works-all";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { ClientWithWorks } from "@/lib/clients/group-with-works";
import { cn } from "@/lib/utils";

interface ClientsWorksAllWorkspaceProps {
  groups: ClientWithWorks[];
  selectedId: string | null;
  selectedGroup: ClientWithWorks | null;
  sort: ClientsWorksAllListSort;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  clientCount: number;
  withWorksCount: number;
  portfolioCount: number;
  hasActiveFilters?: boolean;
  onSelect: (id: string) => void;
  onClosePanel: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: ClientsWorksAllListSort) => void;
  onResetFilters?: () => void;
  className?: string;
}

export function ClientsWorksAllWorkspace({
  groups,
  selectedId,
  selectedGroup,
  sort,
  page,
  pageSize,
  total,
  totalPages,
  rangeStart,
  rangeEnd,
  clientCount,
  withWorksCount,
  portfolioCount,
  hasActiveFilters = false,
  onSelect,
  onClosePanel,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onResetFilters,
  className,
}: ClientsWorksAllWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 gap-3 overflow-hidden",
        CMS_FLEX_CHILD,
        className,
      )}
    >
      <GlassSurface className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between gap-2 border-(--separator) border-b px-4 py-3">
          <div>
            <h2 className="font-semibold text-sm">Clients & works</h2>
            <p className="text-muted-foreground text-xs">
              {clientCount} clients · {withWorksCount} with portfolio ·{" "}
              {portfolioCount} works
            </p>
          </div>
        </div>
        {groups.length > 0 ? (
          <>
            <div className={CMS_SCROLL_REGION}>
              <ClientsWorksAllTable
                groups={groups}
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
              itemLabel="clients"
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <p className="font-medium text-sm">No matching clients</p>
            <p className="mt-1 max-w-sm text-muted-foreground text-sm leading-relaxed">
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "No clients to display."}
            </p>
            {hasActiveFilters && onResetFilters ? (
              <button
                type="button"
                onClick={onResetFilters}
                className="mt-3 text-primary text-sm hover:underline"
              >
                Reset filters
              </button>
            ) : null}
          </div>
        )}
      </GlassSurface>

      {selectedGroup ? (
        <GlassSurface className="hidden min-h-0 w-[24rem] shrink-0 flex-col overflow-hidden lg:flex">
          <ClientsWorksAllDetailPanel
            group={selectedGroup}
            onClose={onClosePanel}
          />
        </GlassSurface>
      ) : null}
    </div>
  );
}
