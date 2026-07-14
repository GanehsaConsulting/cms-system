import { ClientsWorksAllView } from "@/components/cms/clients/clients-works-all-view";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";

export default async function ClientsWorksAllPage() {
  const [clients, portfolio] = await Promise.all([
    getClients(),
    getPortfolioItems(),
  ]);

  return <ClientsWorksAllView clients={clients} portfolio={portfolio} />;
}
