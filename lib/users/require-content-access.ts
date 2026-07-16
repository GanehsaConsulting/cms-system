import { getCurrentCmsUser } from "@/lib/users/current";
import type { User } from "@/types/user";

/** Content editors — Admin and Super Admin may mutate CMS content. */
export function canMutateCmsContent(
  user: Pick<User, "role" | "status"> | null | undefined,
): boolean {
  if (!user || user.status !== "active") {
    return false;
  }

  return user.role === "super-admin" || user.role === "admin";
}

export async function requireCmsContentAccess(): Promise<
  { ok: true; user: User } | { ok: false; error: string }
> {
  const user = await getCurrentCmsUser();

  if (!user || !canMutateCmsContent(user)) {
    return {
      ok: false,
      error: "You do not have permission to manage content.",
    };
  }

  return { ok: true, user };
}
