import { PriceForm } from "@/components/cms/price-form";
import { resolveCmsActiveBrandId } from "@/lib/brands/active-brand";
import { getPriceCategories } from "@/lib/db/price-categories";

export default async function NewPricePage() {
  const brandId = await resolveCmsActiveBrandId();
  const categories = brandId ? await getPriceCategories(brandId) : [];

  return <PriceForm categories={categories} />;
}
