import { PortfolioForm } from "@/components/cms/portfolio-form";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getClients } from "@/lib/db/clients";

export default async function NewPortfolioPage() {
  const brand = await requireCmsNavHref("/clients");
  const clients = await getClients(brand.id);

  return <PortfolioForm clients={clients} />;
}
