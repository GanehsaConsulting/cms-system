import { ClientForm } from "@/components/cms/client-form";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";

export default async function NewClientPage() {
  await requireCmsNavHref("/clients");

  return <ClientForm />;
}
