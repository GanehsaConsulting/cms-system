"use client";

import { useMemo } from "react";
import type { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Controller } from "react-hook-form";
import { PriceFormFieldHint } from "@/components/cms/prices/price-form-field-hint";
import { Checkbox } from "@/components/ui/checkbox";
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
  setValue: UseFormSetValue<PriceFormValues>;
}

export function PriceFormPricingFields({
  control,
  watch,
  setValue,
}: PriceFormPricingFieldsProps) {
  const price = watch("price");
  const strikethroughPrice = watch("strikethroughPrice");
  const showStartingFrom = watch("showStartingFrom");

  const discount = useMemo(
    () =>
      showStartingFrom
        ? 0
        : calculateDiscountPercent(price, strikethroughPrice),
    [price, showStartingFrom, strikethroughPrice],
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
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Input
                id="price"
                inputMode="numeric"
                placeholder="1,900,000"
                aria-invalid={fieldState.invalid}
                className="font-medium tabular-nums"
                value={formatPriceAmountInput(field.value)}
                onChange={(event) =>
                  field.onChange(parsePriceAmount(event.target.value))
                }
              />
              {fieldState.error ? (
                <p className="text-destructive text-xs">
                  {fieldState.error.message}
                </p>
              ) : price > 0 ? (
                <p className="font-medium text-chart-3 text-xs tabular-nums">
                  {formatPriceCurrency(price)}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <Controller
        control={control}
        name="showStartingFrom"
        render={({ field }) => (
          <div
            className={cn(
              RADIUS_DEEP,
              "flex items-start gap-3 bg-muted/50 px-3 py-2.5",
            )}
          >
            <Checkbox
              id="showStartingFrom"
              className="mt-0.5"
              checked={field.value}
              onCheckedChange={(checked) => {
                const next = checked === true;
                field.onChange(next);
                if (next) {
                  setValue("strikethroughPrice", 0, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
            />
            <div className="min-w-0 space-y-0.5">
              <Label
                htmlFor="showStartingFrom"
                className="font-medium text-sm leading-snug"
              >
                Show “Starting from”
              </Label>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Hide the gimmick strikethrough and show a starting-from label
                on the public card instead.
              </p>
            </div>
          </div>
        )}
      />

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label
            htmlFor="strikethroughPrice"
            className={showStartingFrom ? "text-muted-foreground" : undefined}
          >
            Gimmick price (IDR)
          </Label>
          <PriceFormFieldHint label="About gimmick price">
            The crossed-out “was” price used for marketing. Must be higher than
            the display price to show a discount. Disabled when “Starting from”
            is on.
          </PriceFormFieldHint>
        </div>
        <Controller
          control={control}
          name="strikethroughPrice"
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Input
                id="strikethroughPrice"
                inputMode="numeric"
                placeholder="2,836,000"
                aria-invalid={fieldState.invalid}
                className="tabular-nums"
                disabled={showStartingFrom}
                value={formatPriceAmountInput(field.value)}
                onChange={(event) =>
                  field.onChange(parsePriceAmount(event.target.value))
                }
              />
              {fieldState.error ? (
                <p className="text-destructive text-xs">
                  {fieldState.error.message}
                </p>
              ) : !showStartingFrom && strikethroughPrice > 0 ? (
                <p className="text-muted-foreground text-xs tabular-nums line-through">
                  {formatPriceCurrency(strikethroughPrice)}
                </p>
              ) : null}
            </div>
          )}
        />
      </div>

      <div
        className={cn(
          RADIUS_DEEP,
          "space-y-1.5 bg-muted/50 px-3 py-2.5 text-xs",
        )}
        role="status"
      >
        <p className="font-medium text-foreground">Discount preview</p>
        {showStartingFrom ? (
          <p className="text-muted-foreground leading-relaxed">
            Public card shows{" "}
            <span className="font-medium text-foreground">
              Starting from {formatPriceCurrency(price || 0)}
            </span>
            . Gimmick price is cleared.
          </p>
        ) : discount > 0 ? (
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
            discount percentage, or enable “Starting from”.
          </p>
        )}
      </div>
    </div>
  );
}
