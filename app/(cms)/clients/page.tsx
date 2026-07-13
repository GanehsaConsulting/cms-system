import { ClientsListView } from "@/components/cms/clients/clients-list-view";
import { getClients } from "@/lib/db/clients";

export default async function ClientsPage() {
  const clients = await getClients();

  return <ClientsListView clients={clients} />;
}
