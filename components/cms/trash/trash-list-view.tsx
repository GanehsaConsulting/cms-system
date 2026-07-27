"use client";

import { useMemo } from "react";
import { TrashEmptyButton } from "@/components/cms/trash/trash-empty-button";
import { TrashEmptyState } from "@/components/cms/trash/trash-empty-state";
import { TrashListBulkBar } from "@/components/cms/trash/trash-list-bulk-bar";
import { TrashListStats } from "@/components/cms/trash/trash-list-stats";
import { TrashListTable } from "@/components/cms/trash/trash-list-table";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CmsPageHeaderActions } from "@/components/shared/cms-page-header-actions";
import { getTrashListStats } from "@/config/trash";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION, STACK_GAP } from "@/config/spacing";
import { useListBulkSelection } from "@/hooks/use-list-bulk-selection";
import { trashItemKey, type TrashListItem } from "@/types/trash";
import { cn } from "@/lib/utils";

interface TrashListViewProps {
  items: TrashListItem[];
}

export function TrashListView({ items }: TrashListViewProps) {
  const visibleKeys = useMemo(
    () => items.map((item) => trashItemKey(item)),
    [items],
  );

  const stats = useMemo(() => getTrashListStats(items), [items]);
  const bulk = useListBulkSelection(visibleKeys);

  const headerActions = useMemo(() => {
    if (items.length === 0) {
      return null;
    }
    return <TrashEmptyButton />;
  }, [items.length]);

  return (
    <>
      <CmsPageHeaderActions>{headerActions}</CmsPageHeaderActions>

      {items.length === 0 ? (
        <TrashEmptyState />
      ) : (
        <div
          className={cn(
            CMS_FLEX_CHILD,
            "flex min-h-0 flex-col",
            STACK_GAP,
          )}
        >
          <TrashListStats stats={stats} />

          <GlassSurface className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className={CMS_SCROLL_REGION}>
              <TrashListTable
                items={items}
                bulkSelectedKeys={bulk.selectedIdSet}
                isAllBulkSelected={bulk.isAllSelected}
                isBulkIndeterminate={bulk.isIndeterminate}
                onToggleBulk={bulk.toggle}
                onToggleBulkAll={(checked) => {
                  if (checked) {
                    bulk.selectAll();
                  } else {
                    bulk.clear();
                  }
                }}
              />
            </div>
            <TrashListBulkBar
              selectedKeys={bulk.selectedIds}
              onClear={bulk.clear}
            />
          </GlassSurface>
        </div>
      )}
    </>
  );
}
