"use client";

import { ContentActivityListTableRow } from "@/components/cms/content-activities/content-activity-list-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { CmsListTableSortHead } from "@/components/shared/cms-list-table-sort-head";
import { TableHead } from "@/components/ui/table";
import {
  CONTENT_ACTIVITIES_TABLE_SORT_MAP,
  type ContentActivitiesListSort,
} from "@/config/content-activities-list";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { ContentActivity } from "@/types/content-activity";

interface ContentActivitiesListTableProps {
  items: ContentActivity[];
  selectedId: string | null;
  sort: ContentActivitiesListSort;
  onSelect: (id: string) => void;
  onSortChange: (sort: ContentActivitiesListSort) => void;
}

export function ContentActivitiesListTable({
  items,
  selectedId,
  sort,
  onSelect,
  onSortChange,
}: ContentActivitiesListTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <CmsListTableSortHead
            label="Title"
            column="title"
            sort={sort}
            sortMap={CONTENT_ACTIVITIES_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Type</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Status</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Title display</TableHead>
          <CmsListTableSortHead
            label="Display date"
            column="display"
            sort={sort}
            sortMap={CONTENT_ACTIVITIES_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Clicks"
            column="clicks"
            sort={sort}
            sortMap={CONTENT_ACTIVITIES_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={`${LIST_TABLE_HEAD_CLASS} w-12 text-right`}>
            Actions
          </TableHead>
        </>
      }
    >
      {items.map((item) => (
        <ContentActivityListTableRow
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
        />
      ))}
    </CmsListTable>
  );
}
