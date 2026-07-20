import { isUserRoleId } from "@/config/user";
import type { User } from "@/types/user";

/** Raw user shape from DB or JSON — role/status may be plain strings. */
type UserInputLike = Omit<User, "role" | "status"> & {
  role: string;
  status: string;
};

export function normalizeUser(user: UserInputLike): User {
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
