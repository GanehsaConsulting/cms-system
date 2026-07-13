"use client";

import { BannerListTableRow } from "@/components/cms/banners/banner-list-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { CmsListTableSortHead } from "@/components/shared/cms-list-table-sort-head";
import { TableHead } from "@/components/ui/table";
import {
  BANNER_TABLE_SORT_MAP,
  type BannerListSort,
} from "@/config/banner-list";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { Banner } from "@/types/banner";

interface BannerListTableProps {
  banners: Banner[];
  sort: BannerListSort;
  onSortChange: (sort: BannerListSort) => void;
  onEdit: (banner: Banner) => void;
}

export function BannerListTable({
  banners,
  sort,
  onSortChange,
  onEdit,
}: BannerListTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <TableHead className={`${LIST_TABLE_HEAD_CLASS} w-28`}>
            Image
          </TableHead>
          <CmsListTableSortHead
            label="Name"
            column="name"
            sort={sort}
            sortMap={BANNER_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Key"
            column="key"
            sort={sort}
            sortMap={BANNER_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Status"
            column="status"
            sort={sort}
            sortMap={BANNER_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Updated"
            column="updated"
            sort={sort}
            sortMap={BANNER_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={`${LIST_TABLE_HEAD_CLASS} w-12 text-right`}>
            Actions
          </TableHead>
        </>
      }
    >
      {banners.map((banner) => (
        <BannerListTableRow
          key={banner.id}
          banner={banner}
          onEdit={onEdit}
        />
      ))}
    </CmsListTable>
  );
}
