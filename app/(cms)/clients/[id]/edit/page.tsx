import { notFound } from "next/navigation";
import { ClientForm } from "@/components/cms/client-form";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getClientById } from "@/lib/db/clients";

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  const brandId = await resolveCmsActiveBrandId();

  if (!brandId) {
    notFound();
  }

  const client = await getClientById(brandId, id);

  if (!client) {
    notFound();
  }

  return <ClientForm client={client} />;
}
