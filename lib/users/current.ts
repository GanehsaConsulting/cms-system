import { CURRENT_CMS_USER } from "@/config/cms-user";
import { getUserById } from "@/lib/db/users";
import type { User } from "@/types/user";

/** Placeholder session user until auth is wired. */
export async function getCurrentCmsUser(): Promise<User | null> {
  return getUserById(CURRENT_CMS_USER.id);
}
