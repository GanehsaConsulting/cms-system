import { isSuperAdmin } from "@/lib/users/permissions";
import { getCurrentCmsUser } from "@/lib/users/current";
import type { User } from "@/types/user";

export async function requireSuperAdminAccess(): Promise<
  { ok: true; user: User } | { ok: false; error: string }
> {
  const user = await getCurrentCmsUser();

  if (!user || !isSuperAdmin(user)) {
    return {
      ok: false,
      error: "Only Super Admin can perform this action.",
    };
  }

  return { ok: true, user };
}
