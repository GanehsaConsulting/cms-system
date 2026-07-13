"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PRICE_SERVICE_SLUGS } from "@/config/price-services";
import type { PriceFormValues } from "@/lib/validations/price";

interface PriceFormMetaFieldsProps {
  control: Control<PriceFormValues>;
}

export function PriceFormMetaFields({ control }: PriceFormMetaFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Controller
          control={control}
          name="slug"
          render={({ field }) => (
            <Input
              id="slug"
              placeholder="auto-generated from package name"
              {...field}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceSlug">Service slug</Label>
        <Controller
          control={control}
          name="serviceSlug"
          render={({ field }) => (
            <>
              <Input
                id="serviceSlug"
                list="price-service-slug-options"
                placeholder="e.g. virtual-office"
                {...field}
              />
              <datalist id="price-service-slug-options">
                {PRICE_SERVICE_SLUGS.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </>
          )}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="category">Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Input
              id="category"
              placeholder="Section grouping on the public site"
              {...field}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="highlighted"
        render={({ field }) => (
          <div className="flex items-start gap-3 rounded-lg border border-input bg-muted/15 p-3 md:col-span-2">
            <Checkbox
              id="highlighted"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <div className="space-y-1">
              <Label htmlFor="highlighted" className="font-medium text-sm">
                Highlighted package
              </Label>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Mark this plan as featured on the public pricing page.
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
