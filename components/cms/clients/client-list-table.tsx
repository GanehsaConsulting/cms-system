"use client";

import { ClientListTableRow } from "@/components/cms/clients/client-list-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { CmsListTableSortHead } from "@/components/shared/cms-list-table-sort-head";
import { TableHead } from "@/components/ui/table";
import {
  CLIENT_TABLE_SORT_MAP,
  type ClientListSort,
} from "@/config/client-list";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { Client } from "@/types/client";

interface ClientListTableProps {
  clients: Client[];
  selectedId: string | null;
  sort: ClientListSort;
  onSelect: (id: string) => void;
  onSortChange: (sort: ClientListSort) => void;
}

export function ClientListTable({
  clients,
  selectedId,
  sort,
  onSelect,
  onSortChange,
}: ClientListTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <CmsListTableSortHead
            label="Client"
            column="name"
            sort={sort}
            sortMap={CLIENT_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <CmsListTableSortHead
            label="Featured"
            column="featured"
            sort={sort}
            sortMap={CLIENT_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Testimonials</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Photos</TableHead>
          <CmsListTableSortHead
            label="Updated"
            column="updated"
            sort={sort}
            sortMap={CLIENT_TABLE_SORT_MAP}
            onSortChange={onSortChange}
          />
          <TableHead className={`${LIST_TABLE_HEAD_CLASS} w-12 text-right`}>
            Actions
          </TableHead>
        </>
      }
    >
      {clients.map((client) => (
        <ClientListTableRow
          key={client.id}
          client={client}
          isSelected={selectedId === client.id}
          onSelect={onSelect}
        />
      ))}
    </CmsListTable>
  );
}
