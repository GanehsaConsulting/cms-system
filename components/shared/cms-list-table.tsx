"use client";

import type { ReactNode } from "react";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import {
  LIST_TABLE_CLASS,
  LIST_TABLE_WRAP_CLASS,
} from "@/config/list-table";

interface CmsListTableProps {
  header: ReactNode;
  children: ReactNode;
}

export function CmsListTable({ header, children }: CmsListTableProps) {
  return (
    <div className={LIST_TABLE_WRAP_CLASS}>
      <Table className={LIST_TABLE_CLASS}>
        <TableHeader>
          <TableRow className="border-[color:var(--separator)] hover:bg-transparent">
            {header}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
