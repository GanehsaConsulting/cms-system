"use client";

import { ClientsWorksAllTableRow } from "@/components/cms/clients/clients-works-all-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { CmsListTableSortHead } from "@/components/shared/cms-list-table-sort-head";
import { TableHead } from "@/components/ui/table";
import {
  CLIENTS_WORKS_ALL_TABLE_SORT_MAP,
  type ClientsWorksAllListSort,
} from "@/config/clients-works-all";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { ClientWithWorks } from "@/lib/clients/group-with-works";

interface ClientsWorksAllTableProps {
  groups: ClientWithWorks[];
  selectedId: string | null;
  sort: ClientsWorksAllListSort;
  onSelect: (id: string) => void;
  onSortChange: (sort: ClientsWorksAllListSort) => void;
}

export function ClientsWorksAllTable({
  groups,
  selectedId,
  sort,
  onSelect,
  onSortChange,
}: ClientsWorksAllTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <CmsListTableSortHead
            label="Client"
            column="name"
            sort={sort}
            sortMap={CLIENTS_WORKS_ALL_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Contents</TableHead>
          <CmsListTableSortHead
            label="Portfolio"
            column="portfolio"
            sort={sort}
            sortMap={CLIENTS_WORKS_ALL_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Featured"
            column="featured"
            sort={sort}
            sortMap={CLIENTS_WORKS_ALL_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Updated"
            column="updated"
            sort={sort}
            sortMap={CLIENTS_WORKS_ALL_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={`${LIST_TABLE_HEAD_CLASS} w-28 text-right`}>
            Actions
          </TableHead>
        </>
      }
    >
      {groups.map((group) => (
        <ClientsWorksAllTableRow
          key={group.client.id}
          group={group}
          isSelected={selectedId === group.client.id}
          onSelect={onSelect}
        />
      ))}
    </CmsListTable>
  );
}
