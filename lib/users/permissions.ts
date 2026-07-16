import type { User } from "@/types/user";

export function isSuperAdmin(
  user: Pick<User, "role"> | null | undefined,
): boolean {
  return user?.role === "super-admin";
}

/** Brand & user management — Super Admin only. */
export function canAccessCmsSettings(
  user: Pick<User, "role"> | null | undefined,
): boolean {
  return isSuperAdmin(user);
}

/**
 * Super Admin may open every CMS page and nav item,
 * regardless of the active brand's feature flags.
 */
export function canAccessAllCmsPages(
  user: Pick<User, "role"> | null | undefined,
): boolean {
  return isSuperAdmin(user);
}
