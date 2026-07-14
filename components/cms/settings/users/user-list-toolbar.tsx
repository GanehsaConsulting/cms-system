"use client";

import { UserListCreateButton } from "@/components/cms/settings/users/user-list-create-button";
import { UserListFilter } from "@/components/cms/settings/users/user-list-filter";
import { UserListSearch } from "@/components/cms/settings/users/user-list-search";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";
import type {
  UserListSort,
  UserRoleFilter,
  UserStatusFilter,
} from "@/config/user-list";

interface UserListToolbarProps {
  search: string;
  statusFilter: UserStatusFilter;
  roleFilter: UserRoleFilter;
  sort: UserListSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (filter: UserStatusFilter) => void;
  onRoleFilterChange: (filter: UserRoleFilter) => void;
  onSortChange: (sort: UserListSort) => void;
  onResetFilters: () => void;
  onCreate: () => void;
}

export function UserListToolbar({
  search,
  statusFilter,
  roleFilter,
  sort,
  hasActiveFilters,
  onSearchChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onSortChange,
  onResetFilters,
  onCreate,
}: UserListToolbarProps) {
  return (
    <div className={LIST_TOOLBAR_CLASS}>
      <UserListFilter
        statusFilter={statusFilter}
        roleFilter={roleFilter}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        onStatusFilterChange={onStatusFilterChange}
        onRoleFilterChange={onRoleFilterChange}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />
      <UserListSearch value={search} onChange={onSearchChange} />
      <UserListCreateButton onClick={onCreate} />
    </div>
  );
}
