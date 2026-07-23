import { Suspense } from "react";
import { ClientsListView } from "@/components/cms/clients/clients-list-view";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { filterClientsForLogosTab } from "@/lib/clients/content-kinds";
import { getClients } from "@/lib/db/clients";
import { cn } from "@/lib/utils";

export default function ClientsLogosPage() {
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
      <ClientsLogosContent />
    </Suspense>
  );
}

async function ClientsLogosContent() {
  const brand = await requireCmsNavHref("/clients");
  const clients = await getClients(brand.id);
  const logoClients = filterClientsForLogosTab(clients);

  return (
    <ClientsListView
      clients={logoClients}
      emptyTitle="No client logos yet"
      emptyDescription="Add a logo on a client profile. The public marquee uses logos whose URL includes /company_logos/."
    />
  );
}
