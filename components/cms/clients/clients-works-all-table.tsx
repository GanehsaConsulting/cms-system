"use client";

import { ClientsWorksAllTableRow } from "@/components/cms/clients/clients-works-all-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { TableHead } from "@/components/ui/table";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { ClientWithWorks } from "@/lib/clients/group-with-works";

interface ClientsWorksAllTableProps {
  groups: ClientWithWorks[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ClientsWorksAllTable({
  groups,
  selectedId,
  onSelect,
}: ClientsWorksAllTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Client</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Portfolio</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Featured</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Updated</TableHead>
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
