import { PortfolioForm } from "@/components/cms/portfolio-form";
import { getClients } from "@/lib/db/clients";

interface NewPortfolioPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function NewPortfolioPage({
  searchParams,
}: NewPortfolioPageProps) {
  const clients = await getClients();
  const { clientId } = await searchParams;
  const defaultClientId =
    clientId && clients.some((client) => client.id === clientId)
      ? clientId
      : "";

  return (
    <PortfolioForm clients={clients} defaultClientId={defaultClientId} />
  );
}
