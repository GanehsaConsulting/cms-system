"use client";

import { PortfolioListTableRow } from "@/components/cms/portfolio/portfolio-list-table-row";
import { CmsListBulkCheckbox } from "@/components/shared/cms-list-bulk-checkbox";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { CmsListTableSortHead } from "@/components/shared/cms-list-table-sort-head";
import { TableHead } from "@/components/ui/table";
import {
  PORTFOLIO_TABLE_SORT_MAP,
  type PortfolioListSort,
} from "@/config/portfolio-list";
import {
  LIST_TABLE_BULK_HEAD_CLASS,
  LIST_TABLE_HEAD_CLASS,
} from "@/config/list-table";
import type { Portfolio } from "@/types/portfolio";

interface PortfolioListTableProps {
  items: Portfolio[];
  clientNameById: Map<string, string>;
  selectedId: string | null;
  sort: PortfolioListSort;
  bulkSelectedIds: Set<string>;
  isAllBulkSelected: boolean;
  isBulkIndeterminate: boolean;
  onSelect: (id: string) => void;
  onSortChange: (sort: PortfolioListSort) => void;
  onToggleBulk: (id: string) => void;
  onToggleBulkAll: (checked: boolean) => void;
}

export function PortfolioListTable({
  items,
  clientNameById,
  selectedId,
  sort,
  bulkSelectedIds,
  isAllBulkSelected,
  isBulkIndeterminate,
  onSelect,
  onSortChange,
  onToggleBulk,
  onToggleBulkAll,
}: PortfolioListTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <TableHead className={LIST_TABLE_BULK_HEAD_CLASS}>
            <CmsListBulkCheckbox
              checked={isAllBulkSelected}
              indeterminate={isBulkIndeterminate}
              label="Select all works on this page"
              onCheckedChange={onToggleBulkAll}
            />
          </TableHead>
          <CmsListTableSortHead
            label="Work"
            column="title"
            sort={sort}
            sortMap={PORTFOLIO_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Type</TableHead>
          <CmsListTableSortHead
            label="Featured"
            column="featured"
            sort={sort}
            sortMap={PORTFOLIO_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Clicks</TableHead>
          <CmsListTableSortHead
            label="Updated"
            column="updated"
            sort={sort}
            sortMap={PORTFOLIO_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={`${LIST_TABLE_HEAD_CLASS} w-12 text-right`}>
            Actions
          </TableHead>
        </>
      }
    >
      {items.map((item) => (
        <PortfolioListTableRow
          key={item.id}
          item={item}
          clientName={clientNameById.get(item.clientId) ?? ""}
          isSelected={selectedId === item.id}
          isBulkSelected={bulkSelectedIds.has(item.id)}
          onSelect={onSelect}
          onToggleBulk={onToggleBulk}
        />
      ))}
    </CmsListTable>
  );
}
