import { PortfolioListView } from "@/components/cms/portfolio/portfolio-list-view";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";

export default async function PortfolioPage() {
  const brandId = await resolveCmsActiveBrandId();
  const [items, clients] = await Promise.all([
    brandId ? getPortfolioItems(brandId) : Promise.resolve([]),
    brandId ? getClients(brandId) : Promise.resolve([]),
  ]);

  return <PortfolioListView items={items} clients={clients} />;
}
