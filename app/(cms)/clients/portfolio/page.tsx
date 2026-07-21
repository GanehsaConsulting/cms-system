import { Suspense } from "react";
import { PortfolioListView } from "@/components/cms/portfolio/portfolio-list-view";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getClients } from "@/lib/db/clients";
import { getPortfolioItems } from "@/lib/db/portfolio";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  return (
    <Suspense
      fallback={
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            SECTION_BODY_PADDING,
          )}
        >
          <CmsListBodySkeleton />
        </div>
      }
    >
      <PortfolioContent />
    </Suspense>
  );
}

async function PortfolioContent() {
  const brand = await requireCmsNavHref("/clients");
  const [items, clients] = await Promise.all([
    getPortfolioItems(brand.id),
    getClients(brand.id),
  ]);

  return <PortfolioListView items={items} clients={clients} />;
}
