"use client";

import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { UserRoleBadge } from "@/components/cms/settings/users/user-role-badge";
import { UserRowActionsMenu } from "@/components/cms/settings/users/user-row-actions-menu";
import { UserStatusBadge } from "@/components/cms/settings/users/user-status-badge";
import { CmsListTableRow } from "@/components/shared/cms-list-table-row";
import { TableCell } from "@/components/ui/table";
import { LIST_TABLE_CELL_CLASS } from "@/config/list-table";
import {
  formatUserBrandAccessSummary,
  getUserBrandAccessLabels,
} from "@/lib/users/list";
import type { Brand } from "@/types/brand";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";

interface UserListTableRowProps {
  user: User;
  brands: Brand[];
  onEdit: (user: User) => void;
}

export function UserListTableRow({
  user,
  brands,
  onEdit,
}: UserListTableRowProps) {
  const brandLabels = getUserBrandAccessLabels(user, brands);
  const brandSummary = formatUserBrandAccessSummary(user, brands);

  return (
    <CmsListTableRow isSelected={false} onClick={() => undefined}>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="flex min-w-[220px] items-center gap-3">
          <SidebarProfileAvatar
            name={user.name}
            avatarUrl={user.avatarUrl}
            size="md"
          />
          <div className="min-w-0">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-muted-foreground text-xs">
              {user.email}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <p className="truncate text-sm">
          {user.position || "—"}
        </p>
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <UserRoleBadge role={user.role} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <UserStatusBadge status={user.status} />
      </TableCell>
      <TableCell className={LIST_TABLE_CELL_CLASS}>
        <div className="min-w-[120px]">
          <p className="text-sm">{brandSummary}</p>
          {brandLabels.length > 1 ? (
            <p className="truncate text-muted-foreground text-xs">
              {brandLabels.join(", ")}
            </p>
          ) : null}
        </div>
      </TableCell>
      <TableCell className={cn(LIST_TABLE_CELL_CLASS, "text-right")}>
        <UserRowActionsMenu user={user} onEdit={onEdit} />
      </TableCell>
    </CmsListTableRow>
  );
}
