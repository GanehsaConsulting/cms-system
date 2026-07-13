"use client";

import { PlusIcon, TrashIcon } from "@/lib/icons";
import type { Control, UseFormWatch } from "react-hook-form";
import { Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PriceFormValues } from "@/lib/validations/price";
import type { SiteLocale } from "@/types/locale";

interface PriceFormLocaleFieldsProps {
  control: Control<PriceFormValues>;
  watch: UseFormWatch<PriceFormValues>;
  locale: SiteLocale;
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

  const serviceValue = watch(`service.${locale}`);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`service-${locale}`}>Service</Label>
          <Controller
            control={control}
            name={`service.${locale}`}
            render={({ field }) => (
              <Input
                id={`service-${locale}`}
                placeholder="Virtual Office"
                {...field}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`packageName-${locale}`}>Package name</Label>
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
      </div>

      <div className="space-y-2">
        <Label htmlFor={`whatsappLink-${locale}`}>WhatsApp link</Label>
        <Controller
          control={control}
          name={`whatsappLink.${locale}`}
          render={({ field }) => (
            <Input
              id={`whatsappLink-${locale}`}
              type="url"
              placeholder="https://wa.me/6281234567890"
              {...field}
            />
          )}
        />
        <p className="text-muted-foreground text-xs">
          CTA link for {serviceValue || "this service"} in{" "}
          {locale.toUpperCase()}.
        </p>
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

      <div className="space-y-3">
        <Label>Features</Label>
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
                className="size-8 shrink-0"
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
          className="gap-1"
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
      </div>
    </div>
  );
}
