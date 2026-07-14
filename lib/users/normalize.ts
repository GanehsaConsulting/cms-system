import { isUserRoleId } from "@/config/user";
import type { User } from "@/types/user";

export function normalizeUser(user: User): User {
  return {
    ...user,
    name: user.name.trim(),
    email: user.email.trim().toLowerCase(),
    position: user.position.trim(),
    role: isUserRoleId(user.role) ? user.role : "viewer",
    status: user.status === "inactive" ? "inactive" : "active",
    brandAccess: Array.from(
      new Set(user.brandAccess.map((brandId) => brandId.trim()).filter(Boolean)),
    ),
    avatarUrl: user.avatarUrl.trim(),
  };
}
