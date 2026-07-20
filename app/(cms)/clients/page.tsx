import { ClientsWorksAllView } from "@/components/cms/clients/clients-works-all-view";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";

export default async function ClientsWorksAllPage() {
  const brand = await requireCmsNavHref("/clients");
  const [clients, portfolio] = await Promise.all([
    getClients(brand.id),
    getPortfolioItems(brand.id),
  ]);

  return <ClientsWorksAllView clients={clients} portfolio={portfolio} />;
}
