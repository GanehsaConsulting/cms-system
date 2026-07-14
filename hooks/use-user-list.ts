"use client";

import { useMemo, useState } from "react";
import {
  USER_LIST_DEFAULT_SORT,
  type UserListSort,
  type UserRoleFilter,
  type UserStatusFilter,
} from "@/config/user-list";
import { filterUsers, sortUsers } from "@/lib/users/list";
import type { Brand } from "@/types/brand";
import type { User } from "@/types/user";

export function useUserList(users: User[], brands: Brand[]) {
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<UserListSort>(USER_LIST_DEFAULT_SORT);

  const filteredUsers = useMemo(
    () =>
      sortUsers(
        filterUsers(users, brands, statusFilter, roleFilter, search),
        sort,
      ),
    [brands, roleFilter, search, sort, statusFilter, users],
  );

  const hasActiveFilters =
    statusFilter !== "all" ||
    roleFilter !== "all" ||
    search.trim().length > 0 ||
    sort !== USER_LIST_DEFAULT_SORT;

  function resetFilters() {
    setStatusFilter("all");
    setRoleFilter("all");
    setSearch("");
    setSort(USER_LIST_DEFAULT_SORT);
  }

  return {
    users: filteredUsers,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    search,
    setSearch,
    sort,
    setSort,
    hasActiveFilters,
    resetFilters,
    totalCount: users.length,
    filteredCount: filteredUsers.length,
  };
}
