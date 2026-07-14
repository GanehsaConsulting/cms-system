export const USER_FORM_LIMITS = {
  name: 80,
  email: 120,
  position: 80,
} as const;

export const USER_ROLES = [
  {
    id: "super-admin",
    label: "Super Admin",
    description: "Full access across all brands and settings.",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Manage content for assigned brands.",
  },
  {
    id: "viewer",
    label: "Viewer",
    description: "Read-only access to assigned brands.",
  },
] as const;

export type UserRoleId = (typeof USER_ROLES)[number]["id"];

export const USER_ROLE_IDS = USER_ROLES.map((role) => role.id);

export const USER_STATUSES = [
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
] as const;

export function getUserRoleLabel(id: UserRoleId): string {
  return USER_ROLES.find((role) => role.id === id)?.label ?? id;
}

export function isUserRoleId(value: string): value is UserRoleId {
  return USER_ROLE_IDS.includes(value as UserRoleId);
}
