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
 * Super Admin can switch across all brands and open Settings.
 * Sidebar and dashboard modules still follow the active brand's enabled features.
 */
export function canAccessAllCmsPages(
  user: Pick<User, "role"> | null | undefined,
): boolean {
  return isSuperAdmin(user);
}
