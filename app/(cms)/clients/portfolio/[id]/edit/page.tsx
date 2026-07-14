import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/cms/portfolio-form";
import { getClients } from "@/lib/db/clients";
import { getPortfolioById } from "@/lib/db/portfolio";

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  const { id } = await params;
  const [item, clients] = await Promise.all([
    getPortfolioById(id),
    getClients(),
  ]);

  if (!item) {
    notFound();
  }

  return <PortfolioForm item={item} clients={clients} />;
}
