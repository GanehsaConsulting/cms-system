"use client";

import { useMemo } from "react";
import type { Control, UseFormWatch } from "react-hook-form";
import { Controller } from "react-hook-form";
import { PriceFormFieldHint } from "@/components/cms/prices/price-form-field-hint";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RADIUS_DEEP } from "@/config/shape";
import {
  calculateDiscountPercent,
  formatPriceAmountInput,
  formatPriceCurrency,
  parsePriceAmount,
} from "@/lib/prices/format";
import type { PriceFormValues } from "@/lib/validations/price";
import { cn } from "@/lib/utils";

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

  const savings = useMemo(() => {
    if (discount <= 0) {
      return 0;
    }

    return strikethroughPrice - price;
  }, [discount, price, strikethroughPrice]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="price" className="text-chart-3">
            Display price (IDR)
            <span className="text-destructive" aria-hidden>
              {" "}
              *
            </span>
          </Label>
          <PriceFormFieldHint label="About display price">
            The actual selling price shown to customers on the public pricing
            card.
          </PriceFormFieldHint>
        </div>
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <Input
              id="price"
              inputMode="numeric"
              placeholder="1,900,000"
              className="font-medium tabular-nums"
              value={formatPriceAmountInput(field.value)}
              onChange={(event) =>
                field.onChange(parsePriceAmount(event.target.value))
              }
            />
          )}
        />
        {price > 0 ? (
          <p className="font-medium text-chart-3 text-xs tabular-nums">
            {formatPriceCurrency(price)}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="strikethroughPrice">Gimmick price (IDR)</Label>
          <PriceFormFieldHint label="About gimmick price">
            The crossed-out “was” price used for marketing. Must be higher than
            the display price to show a discount.
          </PriceFormFieldHint>
        </div>
        <Controller
          control={control}
          name="strikethroughPrice"
          render={({ field }) => (
            <Input
              id="strikethroughPrice"
              inputMode="numeric"
              placeholder="2,836,000"
              className="tabular-nums"
              value={formatPriceAmountInput(field.value)}
              onChange={(event) =>
                field.onChange(parsePriceAmount(event.target.value))
              }
            />
          )}
        />
        {strikethroughPrice > 0 ? (
          <p className="text-muted-foreground text-xs tabular-nums line-through">
            {formatPriceCurrency(strikethroughPrice)}
          </p>
        ) : null}
      </div>

      <div
        className={cn(
          RADIUS_DEEP,
          "space-y-1.5 bg-muted/50 px-3 py-2.5 text-xs",
        )}
        role="status"
      >
        <p className="font-medium text-foreground">Discount preview</p>
        {discount > 0 ? (
          <>
            <p className="font-semibold text-chart-3 text-sm tabular-nums">
              {discount}% off
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Customers save {formatPriceCurrency(savings)} (
              {formatPriceCurrency(strikethroughPrice)} →{" "}
              {formatPriceCurrency(price)}).
            </p>
          </>
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            Set a gimmick price higher than the display price to calculate the
            discount percentage.
          </p>
        )}
      </div>
    </div>
  );
}
