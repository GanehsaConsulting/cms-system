import { notFound } from "next/navigation";
import { PriceForm } from "@/components/cms/price-form";
import { getPriceById } from "@/lib/db/prices";

interface EditPricePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPricePage({ params }: EditPricePageProps) {
  const { id } = await params;
  const price = await getPriceById(id);

  if (!price) {
    notFound();
  }

  return <PriceForm price={price} />;
}
