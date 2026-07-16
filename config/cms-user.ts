export interface CmsUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  /** Data URL or remote URL — empty when unset. */
  avatarUrl: string;
}

/** Placeholder signed-in user until auth is wired. */
export const CURRENT_CMS_USER: CmsUser = {
  id: "user-rafly",
  name: "Rafly",
  email: "rafly@gbk.co.id",
  role: "Super Admin",
  organization: "Company Profile CMS",
  avatarUrl: "",
};
