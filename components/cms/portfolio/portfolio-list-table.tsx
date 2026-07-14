"use client";

import { PortfolioListTableRow } from "@/components/cms/portfolio/portfolio-list-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { CmsListTableSortHead } from "@/components/shared/cms-list-table-sort-head";
import { TableHead } from "@/components/ui/table";
import {
  PORTFOLIO_TABLE_SORT_MAP,
  type PortfolioListSort,
} from "@/config/portfolio-list";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { Portfolio } from "@/types/portfolio";

interface PortfolioListTableProps {
  items: Portfolio[];
  clientNameById: Map<string, string>;
  selectedId: string | null;
  sort: PortfolioListSort;
  onSelect: (id: string) => void;
  onSortChange: (sort: PortfolioListSort) => void;
}

export function PortfolioListTable({
  items,
  clientNameById,
  selectedId,
  sort,
  onSelect,
  onSortChange,
}: PortfolioListTableProps) {
  return (
    <CmsListTable
      header={
        <>
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
          onSelect={onSelect}
        />
      ))}
    </CmsListTable>
  );
}
