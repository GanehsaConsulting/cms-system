import { ClientsWorksNewDataView } from "@/components/cms/clients/clients-works-new-data-view";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";

export default async function ClientsNewDataPage() {
  await requireCmsNavHref("/clients");

  return <ClientsWorksNewDataView />;
}
