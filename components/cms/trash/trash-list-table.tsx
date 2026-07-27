"use client";

import { TrashListRow } from "@/components/cms/trash/trash-list-row";
import { CmsListBulkCheckbox } from "@/components/shared/cms-list-bulk-checkbox";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { TableHead } from "@/components/ui/table";
import {
  LIST_TABLE_BULK_HEAD_CLASS,
  LIST_TABLE_HEAD_CLASS,
} from "@/config/list-table";
import { trashItemKey, type TrashListItem } from "@/types/trash";
import { cn } from "@/lib/utils";

const HEAD = cn(LIST_TABLE_HEAD_CLASS, "h-10 px-3");
const BULK_HEAD = cn(LIST_TABLE_BULK_HEAD_CLASS, "h-10 px-2.5");

interface TrashListTableProps {
  items: TrashListItem[];
  bulkSelectedKeys: Set<string>;
  isAllBulkSelected: boolean;
  isBulkIndeterminate: boolean;
  onToggleBulk: (key: string) => void;
  onToggleBulkAll: (checked: boolean) => void;
}

export function TrashListTable({
  items,
  bulkSelectedKeys,
  isAllBulkSelected,
  isBulkIndeterminate,
  onToggleBulk,
  onToggleBulkAll,
}: TrashListTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <TableHead className={BULK_HEAD}>
            <CmsListBulkCheckbox
              checked={isAllBulkSelected}
              indeterminate={isBulkIndeterminate}
              label="Select all trash items"
              onCheckedChange={onToggleBulkAll}
            />
          </TableHead>
          <TableHead className={HEAD}>Item</TableHead>
          <TableHead className={cn(HEAD, "w-28")}>Type</TableHead>
          <TableHead className={cn(HEAD, "w-40")}>Deleted</TableHead>
          <TableHead className={cn(HEAD, "w-36")}>Expires</TableHead>
          <TableHead className={cn(HEAD, "w-24 text-right")}>
            Actions
          </TableHead>
        </>
      }
    >
      {items.map((entry) => {
        const key = trashItemKey(entry);
        return (
          <TrashListRow
            key={key}
            entry={entry}
            isBulkSelected={bulkSelectedKeys.has(key)}
            onToggleBulk={() => onToggleBulk(key)}
          />
        );
      })}
    </CmsListTable>
  );
}
