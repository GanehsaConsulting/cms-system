"use client";

import { UserListTableRow } from "@/components/cms/settings/users/user-list-table-row";
import { CmsListTable } from "@/components/shared/cms-list-table";
import { TableHead } from "@/components/ui/table";
import { LIST_TABLE_HEAD_CLASS } from "@/config/list-table";
import type { Brand } from "@/types/brand";
import type { User } from "@/types/user";

interface UserListTableProps {
  users: User[];
  brands: Brand[];
  onEdit: (user: User) => void;
}

export function UserListTable({ users, brands, onEdit }: UserListTableProps) {
  return (
    <CmsListTable
      header={
        <>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>User</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Position</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Role</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Status</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS}>Brand access</TableHead>
          <TableHead className={LIST_TABLE_HEAD_CLASS} />
        </>
      }
    >
      {users.map((user) => (
        <UserListTableRow
          key={user.id}
          user={user}
          brands={brands}
          onEdit={onEdit}
        />
      ))}
    </CmsListTable>
  );
}
