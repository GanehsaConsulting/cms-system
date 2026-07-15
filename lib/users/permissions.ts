import type { User } from "@/types/user";

/** Brand & user management — Super Admin only. */
export function canAccessCmsSettings(
  user: Pick<User, "role"> | null | undefined,
): boolean {
  return user?.role === "super-admin";
}
