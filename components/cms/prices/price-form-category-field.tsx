"use client";

import { useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { PlusIcon } from "@/lib/icons";
import { PriceCategoryFormDialog } from "@/components/cms/prices/price-category-form-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PriceFormValues } from "@/lib/validations/price";
import { toSelectItems } from "@/lib/select-items";
import type { PriceCategory } from "@/types/price-category";

interface PriceFormCategoryFieldProps {
  control: Control<PriceFormValues>;
  categories: PriceCategory[];
  onCategoriesChange: (categories: PriceCategory[]) => void;
}

export function PriceFormCategoryField({
  control,
  categories,
  onCategoriesChange,
}: PriceFormCategoryFieldProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="serviceSlug" className="text-primary">
          Price category
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon className="size-3" />
          New
        </Button>
      </div>
      <Controller
        control={control}
        name="serviceSlug"
        render={({ field, fieldState }) => (
          <div className="flex flex-1 flex-col gap-1.5">
            <Select
              value={field.value || undefined}
              items={toSelectItems(categories)}
              onValueChange={field.onChange}
            >
              <SelectTrigger id="serviceSlug" className="w-full">
                <SelectValue placeholder="Select a price category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error ? (
              <p className="text-destructive text-xs">
                {fieldState.error.message}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs leading-relaxed">
                Which pricing page this card appears on.
              </p>
            )}

            <PriceCategoryFormDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
              onSaved={(category) => {
                onCategoriesChange([...categories, category]);
                field.onChange(category.id);
              }}
            />
          </div>
        )}
      />
    </div>
  );
}
