"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RADIUS_DEEP } from "@/config/shape";
import type { PriceFormValues } from "@/lib/validations/price";
import { cn } from "@/lib/utils";

interface PriceFormHighlightedFieldProps {
  control: Control<PriceFormValues>;
}

export function PriceFormHighlightedField({
  control,
}: PriceFormHighlightedFieldProps) {
  return (
    <div className="flex h-full flex-col gap-2">
      <Label htmlFor="highlighted" className="text-primary">
        Featured
      </Label>
      <Controller
        control={control}
        name="highlighted"
        render={({ field }) => (
          <div
            className={cn(
              RADIUS_DEEP,
              "flex flex-1 items-start gap-3 bg-primary/5 px-3 py-2.5",
            )}
          >
            <Checkbox
              id="highlighted"
              className="mt-0.5"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <div className="min-w-0 space-y-0.5">
              <p className="font-medium text-primary text-sm leading-snug">
                Highlighted package
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Feature this card on the pricing page.
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
