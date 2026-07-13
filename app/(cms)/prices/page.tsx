import { PricesListView } from "@/components/cms/prices/prices-list-view";
import { getPrices } from "@/lib/db/prices";

export default async function PricesPage() {
  const prices = await getPrices();

  return <PricesListView prices={prices} />;
}
