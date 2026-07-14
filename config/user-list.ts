export type UserStatusFilter = "all" | "active" | "inactive";

export type UserRoleFilter = "all" | "super-admin" | "admin" | "viewer";

export type UserListSort =
  | "updated-desc"
  | "updated-asc"
  | "name-asc"
  | "name-desc";

export const USER_STATUS_FILTERS = [
  { id: "all", label: "All statuses" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
] as const satisfies ReadonlyArray<{ id: UserStatusFilter; label: string }>;

export const USER_ROLE_FILTERS = [
  { id: "all", label: "All roles" },
  { id: "super-admin", label: "Super Admin" },
  { id: "admin", label: "Admin" },
  { id: "viewer", label: "Viewer" },
] as const satisfies ReadonlyArray<{ id: UserRoleFilter; label: string }>;

export const USER_LIST_SORT_OPTIONS = [
  { id: "updated-desc", label: "Recently updated" },
  { id: "updated-asc", label: "Oldest updated" },
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
] as const satisfies ReadonlyArray<{ id: UserListSort; label: string }>;

export const USER_LIST_DEFAULT_SORT: UserListSort = "updated-desc";
