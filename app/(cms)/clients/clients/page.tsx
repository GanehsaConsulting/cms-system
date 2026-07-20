import { ClientsListView } from "@/components/cms/clients/clients-list-view";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getClients } from "@/lib/db/clients";

export default async function ClientsListPage() {
  const brand = await requireCmsNavHref("/clients");
  const clients = await getClients(brand.id);

  return <ClientsListView clients={clients} />;
}
