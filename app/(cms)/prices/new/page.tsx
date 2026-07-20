import { PriceForm } from "@/components/cms/price-form";
import { requireCmsNavHref } from "@/lib/brands/require-cms-nav";
import { getPriceCategories } from "@/lib/db/price-categories";

export default async function NewPricePage() {
  const brand = await requireCmsNavHref("/prices");
  const categories = await getPriceCategories(brand.id);

  return <PriceForm categories={categories} />;
}
