"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RADIUS_DEEP } from "@/config/shape";
import type { ClientFormValues } from "@/lib/validations/client";
import { cn } from "@/lib/utils";

interface ClientFormGeneralFieldsProps {
  control: Control<ClientFormValues>;
}

export function ClientFormGeneralFields({
  control,
}: ClientFormGeneralFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-primary">
          Client name
          <span className="text-destructive" aria-hidden>
            {" "}
            *
          </span>
        </Label>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="space-y-1.5">
              <Input
                id="name"
                placeholder="e.g. Nusantara Labs"
                {...field}
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
        <Label htmlFor="website">Website</Label>
        <Controller
          control={control}
          name="website"
          render={({ field }) => (
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              {...field}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              id="description"
              rows={4}
              placeholder="Optional short description for internal reference."
              {...field}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="featured"
        render={({ field }) => (
          <div
            className={cn(
              RADIUS_DEEP,
              "flex items-start gap-3 bg-primary/5 px-3 py-2.5",
            )}
          >
            <Checkbox
              id="featured"
              className="mt-0.5"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked === true)}
            />
            <div className="min-w-0 space-y-0.5">
              <Label
                htmlFor="featured"
                className="font-medium text-primary text-sm"
              >
                Featured client
              </Label>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Highlight this client on public company profile surfaces.
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
