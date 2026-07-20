import { ClientsListView } from "@/components/cms/clients/clients-list-view";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getClients } from "@/lib/db/clients";

export default async function ClientsListPage() {
  const brandId = await resolveCmsActiveBrandId();
  const clients = brandId ? await getClients(brandId) : [];

  return <ClientsListView clients={clients} />;
}
