import { ClientsWorksAllView } from "@/components/cms/clients/clients-works-all-view";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";

export default async function ClientsWorksAllPage() {
  const brandId = await resolveCmsActiveBrandId();
  const [clients, portfolio] = await Promise.all([
    brandId ? getClients(brandId) : Promise.resolve([]),
    brandId ? getPortfolioItems(brandId) : Promise.resolve([]),
  ]);

  return <ClientsWorksAllView clients={clients} portfolio={portfolio} />;
}
