import { PricesListView } from "@/components/cms/prices/prices-list-view";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getPriceCategories } from "@/lib/db/price-categories";
import { getPrices } from "@/lib/db/prices";

export default async function PricesPage() {
  const brand = await requireCmsNavHref("/prices");
  const [prices, categories] = await Promise.all([
    getPrices(brand.id),
    getPriceCategories(brand.id),
  ]);

  return <PricesListView prices={prices} categories={categories} />;
}
