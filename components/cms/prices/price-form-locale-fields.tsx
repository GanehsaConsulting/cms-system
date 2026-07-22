"use client";

import { PlusIcon, TrashIcon } from "@/lib/icons";
import type { Control, UseFormWatch } from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";
import { PriceFormFieldGroup } from "@/components/cms/prices/price-form-field-group";
import { PriceFormWhatsappPhoneField } from "@/components/cms/prices/price-form-whatsapp-phone-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PRICE_FORM_LIMITS } from "@/config/price-form";
import { buildWhatsAppUrl } from "@/lib/prices/whatsapp";
import type { PriceFormValues } from "@/lib/validations/price";
import type { SiteLocale } from "@/types/locale";

interface PriceFormLocaleFieldsProps {
  control: Control<PriceFormValues>;
  watch: UseFormWatch<PriceFormValues>;
  locale: SiteLocale;
}

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden>
      {" "}
      *
    </span>
  );
}

export function PriceFormLocaleFields({
  control,
  watch,
  locale,
}: PriceFormLocaleFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const packageNameValue = watch(`packageName.${locale}`);
  const whatsappPhone = watch("whatsappPhone");
  const whatsappMessage = watch(`whatsappMessage.${locale}`);
  const generatedLink = buildWhatsAppUrl(whatsappPhone, whatsappMessage);

  return (
    <div className="space-y-4">
      <PriceFormFieldGroup
        title="WhatsApp CTA"
        description="Shared number + prefilled chat for this language."
        accent="whatsapp"
      >
        <PriceFormWhatsappPhoneField
          control={control}
          phoneValue={whatsappPhone}
        />

        <div className="space-y-2">
          <Label
            htmlFor={`whatsappMessage-${locale}`}
            className="text-chart-2"
          >
            WhatsApp message
            <RequiredMark />
          </Label>
          <Controller
            control={control}
            name={`whatsappMessage.${locale}`}
            render={({ field }) => (
              <Textarea
                id={`whatsappMessage-${locale}`}
                rows={3}
                maxLength={PRICE_FORM_LIMITS.whatsappMessage}
                placeholder="Hi, I'm interested in using services from Ganesha Consulting"
                className="resize-none"
                {...field}
              />
            )}
          />
          <p className="text-muted-foreground text-xs leading-relaxed">
            Prefill chat text for {packageNameValue || "this package"} in{" "}
            {locale.toUpperCase()}.
          </p>
          {generatedLink ? (
            <p className="break-all font-mono text-chart-2/80 text-[11px] leading-relaxed">
              {generatedLink}
            </p>
          ) : null}
        </div>
      </PriceFormFieldGroup>

      <PriceFormFieldGroup
        title="Package copy"
        description="Names and description shown on the public pricing card."
        accent="content"
      >
        <div className="space-y-2">
          <Label
            htmlFor={`packageName-${locale}`}
            className="text-chart-1"
          >
            Package name
            <RequiredMark />
          </Label>
          <Controller
            control={control}
            name={`packageName.${locale}`}
            render={({ field }) => (
              <Input
                id={`packageName-${locale}`}
                placeholder="Virtual Office Space Lite"
                {...field}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description-${locale}`}>Description</Label>
          <Controller
            control={control}
            name={`description.${locale}`}
            render={({ field }) => (
              <Textarea
                id={`description-${locale}`}
                rows={3}
                placeholder="Optional short description for this package"
                className="resize-none"
                {...field}
              />
            )}
          />
        </div>
      </PriceFormFieldGroup>

      <PriceFormFieldGroup
        title="Features"
        description="Checklist items on the pricing card."
        accent="features"
      >
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <Controller
                control={control}
                name={`features.${index}.name.${locale}`}
                render={({ field: featureField }) => (
                  <Input
                    placeholder="Feature item"
                    value={featureField.value}
                    onChange={featureField.onChange}
                  />
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="size-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={fields.length <= 1}
                aria-label="Remove feature"
                onClick={() => remove(index)}
              >
                <TrashIcon className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1 text-chart-1 hover:bg-chart-1/10"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              name: { id: "", en: "", zh: "" },
            })
          }
        >
          <PlusIcon className="size-3.5" />
          Add feature
        </Button>
      </PriceFormFieldGroup>
    </div>
  );
}
