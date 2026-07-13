"use client";

import type {
  Control,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { PlusIcon, TrashIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CLIENT_FORM_LIMITS } from "@/config/client-form";
import { RADIUS_DEEP } from "@/config/shape";
import { createEmptyTestimonial } from "@/lib/clients/defaults";
import type { ClientFormValues } from "@/lib/validations/client";
import { cn } from "@/lib/utils";

interface ClientFormTestimonialsSectionProps {
  control: Control<ClientFormValues>;
  fields: { id: string }[];
  append: UseFieldArrayAppend<ClientFormValues, "testimonials">;
  remove: UseFieldArrayRemove;
}

export function ClientFormTestimonialsSection({
  control,
  fields,
  append,
  remove,
}: ClientFormTestimonialsSectionProps) {
  const canAdd = fields.length < CLIENT_FORM_LIMITS.maxTestimonials;

  if (fields.length === 0) {
    return (
      <div
        className={cn(
          RADIUS_DEEP,
          "flex flex-col items-center justify-center border border-dashed border-(--separator) bg-muted/30 px-4 py-10 text-center",
        )}
      >
        <p className="font-medium text-sm">No testimonials yet</p>
        <p className="mt-1 max-w-sm text-muted-foreground text-sm">
          Testimonials are optional. Add quotes from this client when you have
          them.
        </p>
        <Button
          type="button"
          className="mt-4 gap-1.5"
          onClick={() => append(createEmptyTestimonial())}
        >
          <PlusIcon className="size-3.5" />
          Add Testimonial
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className={cn(RADIUS_DEEP, "space-y-3 bg-muted/50 p-3.5")}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground">
              Testimonial {index + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => remove(index)}
            >
              <TrashIcon className="size-3.5" />
              Remove
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`testimonial-quote-${index}`}>Quote</Label>
            <Controller
              control={control}
              name={`testimonials.${index}.quote`}
              render={({ field: quoteField, fieldState }) => (
                <div className="space-y-1.5">
                  <Textarea
                    id={`testimonial-quote-${index}`}
                    rows={3}
                    placeholder="What did they say?"
                    {...quoteField}
                  />
                  {fieldState.error ? (
                    <p className="text-destructive text-xs">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </div>
              )}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`testimonial-author-${index}`}>Author name</Label>
              <Controller
                control={control}
                name={`testimonials.${index}.authorName`}
                render={({ field: authorField, fieldState }) => (
                  <div className="space-y-1.5">
                    <Input
                      id={`testimonial-author-${index}`}
                      placeholder="Full name"
                      {...authorField}
                    />
                    {fieldState.error ? (
                      <p className="text-destructive text-xs">
                        {fieldState.error.message}
                      </p>
                    ) : null}
                  </div>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`testimonial-title-${index}`}>Author title</Label>
              <Controller
                control={control}
                name={`testimonials.${index}.authorTitle`}
                render={({ field: titleField }) => (
                  <Input
                    id={`testimonial-title-${index}`}
                    placeholder="Optional role or company"
                    {...titleField}
                  />
                )}
              />
            </div>
          </div>
        </div>
      ))}

      {canAdd ? (
        <Button
          type="button"
          variant="outline"
          className="gap-1.5"
          onClick={() => append(createEmptyTestimonial())}
        >
          <PlusIcon className="size-3.5" />
          Add Testimonial
        </Button>
      ) : null}
    </div>
  );
}
