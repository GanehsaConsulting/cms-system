import { notFound } from "next/navigation";
import { ClientForm } from "@/components/cms/client-form";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getClientById } from "@/lib/db/clients";

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  const brand = await requireCmsNavHref("/clients");
  const client = await getClientById(brand.id, id);

  if (!client) {
    notFound();
  }

  return <ClientForm client={client} />;
}
