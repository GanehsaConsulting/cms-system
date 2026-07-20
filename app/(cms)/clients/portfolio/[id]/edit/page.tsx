import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/cms/portfolio-form";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getClients } from "@/lib/db/clients";
import { getPortfolioById } from "@/lib/db/portfolio";

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  const { id } = await params;
  const brand = await requireCmsNavHref("/clients");
  const [item, clients] = await Promise.all([
    getPortfolioById(brand.id, id),
    getClients(brand.id),
  ]);

  if (!item) {
    notFound();
  }

  return <PortfolioForm item={item} clients={clients} />;
}
