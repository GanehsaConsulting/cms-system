"use client";

import { useEffect, useState } from "react";
import { UserFormDialog } from "@/components/cms/settings/users/user-form-dialog";
import { UserListEmptyState } from "@/components/cms/settings/users/user-list-empty-state";
import { UserListTable } from "@/components/cms/settings/users/user-list-table";
import { UserListToolbar } from "@/components/cms/settings/users/user-list-toolbar";
import { SettingsPageHeader } from "@/components/cms/settings/settings-page-header";
import { GlassSurface } from "@/components/shared/glass-surface";
import { useUserList } from "@/hooks/use-user-list";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION, SHELL_PADDING } from "@/config/spacing";
import type { Brand } from "@/types/brand";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";

interface UserListViewProps {
  users: User[];
  brands: Brand[];
}

export function UserListView({ users: initialUsers, brands }: UserListViewProps) {
  const [users, setUsers] = useState(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const {
    users: visibleUsers,
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
    filteredCount,
  } = useUserList(users, brands);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  function openCreate() {
    setEditingUser(null);
    setDialogOpen(true);
  }

  function openEdit(user: User) {
    setEditingUser(user);
    setDialogOpen(true);
  }

  function handleSaved(user: User) {
    setUsers((current) => {
      const index = current.findIndex((item) => item.id === user.id);
      if (index === -1) {
        return [user, ...current];
      }

      const next = [...current];
      next[index] = user;
      return next;
    });
  }

  if (users.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden",
          SHELL_PADDING,
        )}
      >
        <SettingsPageHeader
          actions={
            <UserListToolbar
              search={search}
              statusFilter={statusFilter}
              roleFilter={roleFilter}
              sort={sort}
              hasActiveFilters={hasActiveFilters}
              onSearchChange={setSearch}
              onStatusFilterChange={setStatusFilter}
              onRoleFilterChange={setRoleFilter}
              onSortChange={setSort}
              onResetFilters={resetFilters}
              onCreate={openCreate}
            />
          }
        />
        <UserListEmptyState onCreate={openCreate} />
        <UserFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          user={editingUser}
          brands={brands}
          onSaved={handleSaved}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SHELL_PADDING,
      )}
    >
      <SettingsPageHeader
        actions={
          <UserListToolbar
            search={search}
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            sort={sort}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearch}
            onStatusFilterChange={setStatusFilter}
            onRoleFilterChange={setRoleFilter}
            onSortChange={setSort}
            onResetFilters={resetFilters}
            onCreate={openCreate}
          />
        }
      />

      <GlassSurface className={cn("flex min-h-0 flex-col overflow-hidden", CMS_FLEX_CHILD)}>
        <div className="flex shrink-0 items-center justify-between gap-2 border-(--separator) border-b px-4 py-3">
          <div>
            <h2 className="font-semibold text-sm">Team members</h2>
            <p className="text-muted-foreground text-xs">
              {filteredCount} of {users.length} user
              {users.length === 1 ? "" : "s"} · manage roles and brand access
            </p>
          </div>
        </div>

        {visibleUsers.length > 0 ? (
          <div className={CMS_SCROLL_REGION}>
            <UserListTable users={visibleUsers} brands={brands} onEdit={openEdit} />
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <p className="font-medium text-sm">No users found</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Try changing filters or search keywords.
            </p>
          </div>
        )}
      </GlassSurface>

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        brands={brands}
        onSaved={handleSaved}
      />
    </div>
  );
}
