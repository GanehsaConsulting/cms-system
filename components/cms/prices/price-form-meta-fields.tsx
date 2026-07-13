"use client";

import type { Control } from "react-hook-form";
import { PriceFormCategoryField } from "@/components/cms/prices/price-form-category-field";
import { PriceFormHighlightedField } from "@/components/cms/prices/price-form-highlighted-field";
import type { PriceFormValues } from "@/lib/validations/price";
import type { PriceCategory } from "@/types/price-category";

interface PriceFormMetaFieldsProps {
  control: Control<PriceFormValues>;
  categories: PriceCategory[];
  onCategoriesChange: (categories: PriceCategory[]) => void;
}

export function PriceFormMetaFields({
  control,
  categories,
  onCategoriesChange,
}: PriceFormMetaFieldsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:items-stretch">
      <PriceFormCategoryField
        control={control}
        categories={categories}
        onCategoriesChange={onCategoriesChange}
      />
      <PriceFormHighlightedField control={control} />
    </div>
  );
}
