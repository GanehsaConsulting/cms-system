import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/cms/portfolio-form";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getClients } from "@/lib/db/clients";
import { getPortfolioById } from "@/lib/db/portfolio";

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  const { id } = await params;
  const brandId = await resolveCmsActiveBrandId();

  if (!brandId) {
    notFound();
  }

  const [item, clients] = await Promise.all([
    getPortfolioById(brandId, id),
    getClients(brandId),
  ]);

  if (!item) {
    notFound();
  }

  return <PortfolioForm item={item} clients={clients} />;
}
