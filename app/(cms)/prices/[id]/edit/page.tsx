import { notFound } from "next/navigation";
import { PriceForm } from "@/components/cms/price-form";
import { getPriceCategories } from "@/lib/db/price-categories";
import { getPriceById } from "@/lib/db/prices";

interface EditPricePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPricePage({ params }: EditPricePageProps) {
  const { id } = await params;
  const [price, categories] = await Promise.all([
    getPriceById(id),
    getPriceCategories(),
  ]);

  if (!price) {
    notFound();
  }

  return <PriceForm price={price} categories={categories} />;
}
