import { Suspense } from "react";
import { PricesListHeader } from "@/components/cms/prices/prices-list-header";
import { PricesListView } from "@/components/cms/prices/prices-list-view";
import { CmsSectionLayout } from "@/components/shared/cms-section-layout";
import { CmsListBodySkeleton } from "@/components/skeletons/cms-list-body-skeleton";
import { SECTION_BODY_PADDING } from "@/config/spacing";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getPriceCategories } from "@/lib/db/price-categories";
import { getPrices } from "@/lib/db/prices";
import { cn } from "@/lib/utils";

export default function PricesPage() {
  return (
    <CmsSectionLayout
      header={
        <header className="mb-4 shrink-0">
          <PricesListHeader />
        </header>
      }
    >
      <Suspense
        fallback={
          <BodyFrame>
            <CmsListBodySkeleton withDetailPanel={false} />
          </BodyFrame>
        }
      >
        <PricesPageContent />
      </Suspense>
    </CmsSectionLayout>
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

async function PricesPageContent() {
  const brand = await requireCmsNavHref("/prices");
  const [prices, categories] = await Promise.all([
    getPrices(brand.id),
    getPriceCategories(brand.id),
  ]);

  return (
    <BodyFrame>
      <PricesListView prices={prices} categories={categories} />
    </BodyFrame>
  );
}
