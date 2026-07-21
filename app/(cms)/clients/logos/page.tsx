import { Suspense } from "react";
import { ClientsListView } from "@/components/cms/clients/clients-list-view";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { filterLogoOnlyClients } from "@/lib/clients/content-kinds";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";
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
  const [clients, portfolio] = await Promise.all([
    getClients(brand.id),
    getPortfolioItems(brand.id),
  ]);
  const logoOnlyClients = filterLogoOnlyClients(clients, portfolio);

  return (
    <ClientsListView
      clients={logoOnlyClients}
      emptyTitle="No logo-only clients"
      emptyDescription="Clients appear here when they have a logo and nothing else attached yet."
    />
  );
}
