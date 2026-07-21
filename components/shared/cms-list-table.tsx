"use client";

import type { ReactNode } from "react";
import { TableBody, TableHeader, TableRow } from "@/components/ui/table";
import {
  LIST_TABLE_CLASS,
  LIST_TABLE_WRAP_CLASS,
} from "@/config/list-table";
import { cn } from "@/lib/utils";

interface CmsListTableProps {
  header: ReactNode;
  children: ReactNode;
}

/**
 * List tables scroll inside parent `CMS_SCROLL_REGION`.
 * Avoid the default shadcn Table overflow wrapper — it creates a nested
 * scrollport and breaks sticky column headers.
 */
export function CmsListTable({ header, children }: CmsListTableProps) {
  return (
    <div className={LIST_TABLE_WRAP_CLASS}>
      <div className="relative w-full">
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm", LIST_TABLE_CLASS)}
        >
          <TableHeader>
            <TableRow className="border-(--separator) hover:bg-transparent">
              {header}
            </TableRow>
          </TableHeader>
          <TableBody>{children}</TableBody>
        </table>
      </div>
    </div>
  );
}
