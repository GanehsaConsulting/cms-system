import { Suspense } from "react";
import { ClientsListView } from "@/components/cms/clients/clients-list-view";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getClients } from "@/lib/db/clients";
import { cn } from "@/lib/utils";

export default function ClientsListPage() {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            SECTION_BODY_PADDING,
          )}
        >
          <CmsListBodySkeleton withDetailPanel={false} />
        </div>
      }
    >
      <ClientsListContent />
    </Suspense>
  );
}

async function ClientsListContent() {
  const brand = await requireCmsNavHref("/clients");
  const clients = await getClients(brand.id);

  return <ClientsListView clients={clients} />;
}
