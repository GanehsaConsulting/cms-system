import { PricesListView } from "@/components/cms/prices/prices-list-view";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getPriceCategories } from "@/lib/db/price-categories";
import { getPrices } from "@/lib/db/prices";

export default async function PricesPage() {
  const brandId = await resolveCmsActiveBrandId();
  const [prices, categories] = await Promise.all([
    brandId ? getPrices(brandId) : Promise.resolve([]),
    brandId ? getPriceCategories(brandId) : Promise.resolve([]),
  ]);

  return <PricesListView prices={prices} categories={categories} />;
}
