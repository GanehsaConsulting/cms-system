"use client";

import { useEffect, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { TrashIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RADIUS_DEEP } from "@/config/shape";
import {
  isValidWhatsAppPhone,
  normalizeWhatsAppPhone,
} from "@/lib/prices/whatsapp";
import {
  readSavedWhatsAppPhones,
  removeSavedWhatsAppPhone,
  saveWhatsAppPhone,
  type SavedWhatsAppPhone,
} from "@/lib/prices/whatsapp-phone-storage";
import type { PriceFormValues } from "@/lib/validations/price";
import { cn } from "@/lib/utils";

interface PriceFormWhatsappPhoneFieldProps {
  control: Control<PriceFormValues>;
  phoneValue: string;
}

export function PriceFormWhatsappPhoneField({
  control,
  phoneValue,
}: PriceFormWhatsappPhoneFieldProps) {
  const [savedPhones, setSavedPhones] = useState<SavedWhatsAppPhone[]>([]);
  const [saveThisNumber, setSaveThisNumber] = useState(false);

  useEffect(() => {
    setSavedPhones(readSavedWhatsAppPhones());
  }, []);

  useEffect(() => {
    const digits = normalizeWhatsAppPhone(phoneValue);
    setSaveThisNumber(
      isValidWhatsAppPhone(digits) &&
        savedPhones.some((entry) => entry.phone === digits),
    );
  }, [phoneValue, savedPhones]);

  function handleSaveToggle(checked: boolean, currentPhone: string) {
    const digits = normalizeWhatsAppPhone(currentPhone);

    if (!checked) {
      setSaveThisNumber(false);
      return;
    }

    if (!isValidWhatsAppPhone(digits)) {
      setSaveThisNumber(false);
      return;
    }

    setSaveThisNumber(true);
    setSavedPhones(saveWhatsAppPhone(digits));
  }

  function handleRemoveSaved(phone: string) {
    setSavedPhones(removeSavedWhatsAppPhone(phone));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="whatsappPhone" className="text-chart-2">
          WhatsApp number
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        </Label>
        <Controller
          control={control}
          name="whatsappPhone"
          render={({ field }) => (
            <label
              htmlFor="save-whatsapp-phone"
              className={cn(
                "flex items-center gap-1.5 text-muted-foreground text-xs",
                !isValidWhatsAppPhone(field.value) && "opacity-50",
              )}
            >
              <Checkbox
                id="save-whatsapp-phone"
                checked={saveThisNumber}
                disabled={!isValidWhatsAppPhone(field.value)}
                onCheckedChange={(checked) =>
                  handleSaveToggle(checked === true, field.value)
                }
              />
              Save this number
            </label>
          )}
        />
      </div>

      <Controller
        control={control}
        name="whatsappPhone"
        render={({ field }) => (
          <Input
            id="whatsappPhone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="628887127000"
            value={field.value}
            onChange={(event) => {
              field.onChange(normalizeWhatsAppPhone(event.target.value));
            }}
          />
        )}
      />

      {savedPhones.length > 0 ? (
        <Controller
          control={control}
          name="whatsappPhone"
          render={({ field }) => (
            <ul className="flex flex-wrap gap-1.5">
              {savedPhones.map((entry) => {
                const isSelected =
                  normalizeWhatsAppPhone(field.value) === entry.phone;

                return (
                  <li
                    key={entry.id}
                    className={cn(
                      RADIUS_DEEP,
                      "flex items-center gap-1 bg-muted/40 pl-2",
                      isSelected && "bg-primary/10",
                    )}
                  >
                    <button
                      type="button"
                      className="font-mono text-xs"
                      onClick={() => {
                        field.onChange(entry.phone);
                        setSaveThisNumber(true);
                      }}
                    >
                      {entry.phone}
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="size-6 shrink-0"
                      aria-label={`Remove saved number ${entry.phone}`}
                      onClick={() => handleRemoveSaved(entry.phone)}
                    >
                      <TrashIcon className="size-3" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        />
      ) : null}
    </div>
  );
}
