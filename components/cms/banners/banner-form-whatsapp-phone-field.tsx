"use client";

import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

interface BannerFormWhatsappPhoneFieldProps {
  id?: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function BannerFormWhatsappPhoneField({
  id = "banner-whatsapp-phone",
  value,
  disabled = false,
  onChange,
}: BannerFormWhatsappPhoneFieldProps) {
  const [savedPhones, setSavedPhones] = useState<SavedWhatsAppPhone[]>([]);
  const [saveThisNumber, setSaveThisNumber] = useState(false);

  useEffect(() => {
    setSavedPhones(readSavedWhatsAppPhones());
  }, []);

  useEffect(() => {
    const digits = normalizeWhatsAppPhone(value);
    setSaveThisNumber(
      isValidWhatsAppPhone(digits) &&
        savedPhones.some((entry) => entry.phone === digits),
    );
  }, [savedPhones, value]);

  function handleSaveToggle(checked: boolean) {
    const digits = normalizeWhatsAppPhone(value);

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
        <Label htmlFor={id} className="text-chart-2">
          WhatsApp number
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        </Label>
        <label
          htmlFor={`${id}-save`}
          className={cn(
            "flex items-center gap-1.5 text-muted-foreground text-xs",
            (!isValidWhatsAppPhone(value) || disabled) && "opacity-50",
          )}
        >
          <Checkbox
            id={`${id}-save`}
            checked={saveThisNumber}
            disabled={disabled || !isValidWhatsAppPhone(value)}
            onCheckedChange={(checked) => handleSaveToggle(checked === true)}
          />
          Save this number
        </label>
      </div>

      <Input
        id={id}
        inputMode="tel"
        autoComplete="tel"
        placeholder="628887127000"
        value={value}
        disabled={disabled}
        onChange={(event) => {
          onChange(normalizeWhatsAppPhone(event.target.value));
        }}
      />

      {savedPhones.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {savedPhones.map((entry) => {
            const isSelected = normalizeWhatsAppPhone(value) === entry.phone;

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
                  disabled={disabled}
                  onClick={() => {
                    onChange(entry.phone);
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
                  disabled={disabled}
                  aria-label={`Remove saved number ${entry.phone}`}
                  onClick={() => handleRemoveSaved(entry.phone)}
                >
                  <TrashIcon className="size-3" />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
