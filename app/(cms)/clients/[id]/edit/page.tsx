import { notFound } from "next/navigation";
import { ClientForm } from "@/components/cms/client-form";
import { getClientById } from "@/lib/db/clients";

interface EditClientPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

  return <ClientForm client={client} />;
}
