import { PriceForm } from "@/components/cms/price-form";
import { getPriceCategories } from "@/lib/db/price-categories";

export default async function NewPricePage() {
  const categories = await getPriceCategories();

  return <PriceForm categories={categories} />;
}
