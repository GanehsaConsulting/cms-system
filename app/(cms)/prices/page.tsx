import { PricesListView } from "@/components/cms/prices/prices-list-view";
import { getPriceCategories } from "@/lib/db/price-categories";
import { getPrices } from "@/lib/db/prices";

export default async function PricesPage() {
  const [prices, categories] = await Promise.all([
    getPrices(),
    getPriceCategories(),
  ]);

  return <PricesListView prices={prices} categories={categories} />;
}
