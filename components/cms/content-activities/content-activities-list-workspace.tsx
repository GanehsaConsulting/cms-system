"use client";

import { ContentActivityDetailPanel } from "@/components/cms/content-activities/content-activity-detail-panel";
import { ContentActivitiesListTable } from "@/components/cms/content-activities/content-activities-list-table";
import { CmsListPagination } from "@/components/shared/cms-list-pagination";
import { GlassSurface } from "@/components/shared/glass-surface";
import type {
  ContentActivitiesListSort,
  ContentActivityKindFilter,
} from "@/config/content-activities-list";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { ContentActivity } from "@/types/content-activity";
import { cn } from "@/lib/utils";

interface ContentActivitiesListWorkspaceProps {
  items: ContentActivity[];
  selectedItem: ContentActivity | null;
  selectedId: string | null;
  kindFilter: ContentActivityKindFilter;
  hasActiveFilters: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  sort: ContentActivitiesListSort;
  onSelect: (id: string) => void;
  onClosePanel: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: ContentActivitiesListSort) => void;
  onResetFilters: () => void;
  className?: string;
}

export function ContentActivitiesListWorkspace({
  items,
  selectedItem,
  selectedId,
  kindFilter,
  hasActiveFilters,
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
  onResetFilters,
  className,
}: ContentActivitiesListWorkspaceProps) {
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
              <ContentActivitiesListTable
                items={items}
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
              itemLabel="activities"
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <p className="font-medium text-sm">No activities found</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Try changing tabs, filters, or search keywords.
            </p>
            {hasActiveFilters || kindFilter !== "all" ? (
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

      {selectedItem ? (
        <GlassSurface className="hidden min-h-0 w-[24rem] shrink-0 flex-col overflow-hidden lg:flex">
          <ContentActivityDetailPanel
            item={selectedItem}
            onClose={onClosePanel}
          />
        </GlassSurface>
      ) : null}
    </div>
  );
}
