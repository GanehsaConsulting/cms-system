import { UserListView } from "@/components/cms/settings/users/user-list-view";
import { getBrands } from "@/lib/db/brands";
import { getUsers } from "@/lib/db/users";

export default async function SettingsUsersPage() {
  const [users, brands] = await Promise.all([getUsers(), getBrands()]);

  return <UserListView users={users} brands={brands} />;
}
