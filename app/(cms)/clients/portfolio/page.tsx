import { PortfolioListView } from "@/components/cms/portfolio/portfolio-list-view";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";

export default async function PortfolioPage() {
  const [items, clients] = await Promise.all([
    getPortfolioItems(),
    getClients(),
  ]);

  return <PortfolioListView items={items} clients={clients} />;
}
