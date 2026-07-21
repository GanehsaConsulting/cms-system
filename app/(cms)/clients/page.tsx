import { Suspense } from "react";
import { ClientsWorksAllView } from "@/components/cms/clients/clients-works-all-view";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";
import { cn } from "@/lib/utils";

export default function ClientsWorksAllPage() {
  return (
    <Suspense
      fallback={
        <BodyFrame>
          <CmsListBodySkeleton />
        </BodyFrame>
      }
    >
      <ClientsWorksAllContent />
    </Suspense>
  );
}

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

async function ClientsWorksAllContent() {
  const brand = await requireCmsNavHref("/clients");
  const [clients, portfolio] = await Promise.all([
    getClients(brand.id),
    getPortfolioItems(brand.id),
  ]);

  return <ClientsWorksAllView clients={clients} portfolio={portfolio} />;
}
