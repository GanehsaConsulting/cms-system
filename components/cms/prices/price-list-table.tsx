"use client";

import { PriceListTableRow } from "@/components/cms/prices/price-list-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { CmsListTableSortHead } from "@/components/shared/cms-list-table-sort-head";
import { TableHead } from "@/components/ui/table";
import {
  PRICE_TABLE_SORT_MAP,
  type PriceListSort,
} from "@/config/price-list";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { Price } from "@/types/price";
import type { PriceCategory } from "@/types/price-category";

interface PriceListTableProps {
  prices: Price[];
  categories: PriceCategory[];
  selectedId: string | null;
  sort: PriceListSort;
  onSelect: (id: string) => void;
  onSortChange: (sort: PriceListSort) => void;
}

export function PriceListTable({
  prices,
  categories,
  selectedId,
  sort,
  onSelect,
  onSortChange,
}: PriceListTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <CmsListTableSortHead
            label="Package"
            column="package"
            sort={sort}
            sortMap={PRICE_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Price"
            column="price"
            sort={sort}
            sortMap={PRICE_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Original</TableHead>
          <CmsListTableSortHead
            label="Status"
            column="status"
            sort={sort}
            sortMap={PRICE_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Updated"
            column="updated"
            sort={sort}
            sortMap={PRICE_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={`${LIST_TABLE_HEAD_CLASS} w-12 text-right`}>
            Actions
          </TableHead>
        </>
      }
    >
      {prices.map((price) => (
        <PriceListTableRow
          key={price.id}
          price={price}
          categories={categories}
          isSelected={selectedId === price.id}
          onSelect={onSelect}
        />
      ))}
    </CmsListTable>
  );
}
