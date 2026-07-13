"use client";

import type { ReactNode } from "react";
import { TableRow } from "@/components/ui/table";
import {
  LIST_TABLE_ROW_BASE,
  LIST_TABLE_ROW_SELECTED,
} from "@/config/list-table";
import { cn } from "@/lib/utils";

interface CmsListTableRowProps {
  isSelected: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function CmsListTableRow({
  isSelected,
  onClick,
  children,
}: CmsListTableRowProps) {
  return (
    <TableRow
      data-state={isSelected ? "selected" : undefined}
      className={cn(
        LIST_TABLE_ROW_BASE,
        isSelected ? LIST_TABLE_ROW_SELECTED : undefined,
      )}
      onClick={onClick}
    >
      {children}
    </TableRow>
  );
}
