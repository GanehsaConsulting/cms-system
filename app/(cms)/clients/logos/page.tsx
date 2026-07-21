import { ClientsListView } from "@/components/cms/clients/clients-list-view";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { filterLogoOnlyClients } from "@/lib/clients/content-kinds";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";

export default async function ClientsLogosPage() {
  const brand = await requireCmsNavHref("/clients");
  const [clients, portfolio] = await Promise.all([
    getClients(brand.id),
    getPortfolioItems(brand.id),
  ]);
  const logoOnlyClients = filterLogoOnlyClients(clients, portfolio);

  return (
    <ClientsListView
      clients={logoOnlyClients}
      description="Clients that only have a logo — no photos, testimonials, or portfolio works."
      emptyTitle="No logo-only clients"
      emptyDescription="Clients appear here when they have a logo and nothing else attached yet."
    />
  );
}
