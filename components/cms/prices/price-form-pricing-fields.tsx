"use client";

import { useMemo } from "react";
import type { Control, UseFormWatch } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateDiscountPercent,
  formatPriceCurrency,
  parsePriceAmount,
} from "@/lib/prices/format";
import type { PriceFormValues } from "@/lib/validations/price";

interface PriceFormPricingFieldsProps {
  control: Control<PriceFormValues>;
  watch: UseFormWatch<PriceFormValues>;
}

export function PriceFormPricingFields({
  control,
  watch,
}: PriceFormPricingFieldsProps) {
  const price = watch("price");
  const strikethroughPrice = watch("strikethroughPrice");

  const discount = useMemo(
    () => calculateDiscountPercent(price, strikethroughPrice),
    [price, strikethroughPrice],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (IDR)</Label>
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <Input
                id="price"
                inputMode="numeric"
                placeholder="1900000"
                value={field.value || ""}
                onChange={(event) =>
                  field.onChange(parsePriceAmount(event.target.value))
                }
              />
            )}
          />
          {price > 0 ? (
            <p className="text-muted-foreground text-xs">
              {formatPriceCurrency(price)}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="strikethroughPrice">Original price (IDR)</Label>
          <Controller
            control={control}
            name="strikethroughPrice"
            render={({ field }) => (
              <Input
                id="strikethroughPrice"
                inputMode="numeric"
                placeholder="2836000"
                value={field.value || ""}
                onChange={(event) =>
                  field.onChange(parsePriceAmount(event.target.value))
                }
              />
            )}
          />
          {strikethroughPrice > 0 ? (
            <p className="text-muted-foreground text-xs">
              {formatPriceCurrency(strikethroughPrice)}
            </p>
          ) : null}
        </div>
      </div>

      {discount > 0 ? (
        <p className="text-muted-foreground text-sm">Discount: {discount}%</p>
      ) : null}
    </div>
  );
}
