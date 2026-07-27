import { Suspense } from "react";
import { ClientsListView } from "@/components/cms/clients/clients-list-view";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { filterClientsForPhotosTab } from "@/lib/clients/content-kinds";
import { getClients } from "@/lib/db/clients";
import { cn } from "@/lib/utils";

function BodyFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SECTION_BODY_PADDING,
      )}
    >
      {children}
    </div>
  );
}

export default function ClientsListPage() {
  return (
    <Suspense
      fallback={
        <BodyFrame>
          <CmsListBodySkeleton withDetailPanel={false} />
        </BodyFrame>
      }
    >
      <ClientsListContent />
    </Suspense>
  );
}

async function ClientsListContent() {
  const brand = await requireCmsNavHref("/clients");
  const clients = await getClients(brand.id);
  const photoClients = filterClientsForPhotosTab(clients);

  return (
    <BodyFrame>
      <ClientsListView
        clients={photoClients}
        previewMode="photo"
        emptyTitle="No client photos yet"
        emptyDescription="Add gallery photos on a client profile. They appear here for the active brand."
      />
    </BodyFrame>
  );
}
