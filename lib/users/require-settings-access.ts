import { canAccessCmsSettings } from "@/lib/users/permissions";
import { getCurrentCmsUser } from "@/lib/users/current";

export async function requireCmsSettingsAccess(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const user = await getCurrentCmsUser();

  if (!canAccessCmsSettings(user)) {
    return {
      ok: false,
      error: "You do not have permission to manage settings.",
    };
  }

  return { ok: true };
}
