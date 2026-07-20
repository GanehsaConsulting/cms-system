import { PortfolioListView } from "@/components/cms/portfolio/portfolio-list-view";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";

export default async function PortfolioPage() {
  const brand = await requireCmsNavHref("/clients");
  const [items, clients] = await Promise.all([
    getPortfolioItems(brand.id),
    getClients(brand.id),
  ]);

  return <PortfolioListView items={items} clients={clients} />;
}
