import type { CmsUser } from "@/config/cms-user";
import { getUserRoleLabel } from "@/config/user";
import type { User } from "@/types/user";

const CMS_ORGANIZATION = "Company Profile CMS";

/** Map auth/CMS user → sidebar & profile display shape. */
export function toSidebarCmsUser(user: User): CmsUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: getUserRoleLabel(user.role),
    organization: CMS_ORGANIZATION,
    avatarUrl: user.avatarUrl,
  };
}
