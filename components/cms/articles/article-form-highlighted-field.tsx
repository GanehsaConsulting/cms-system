"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ArticleFormValues } from "@/lib/validations/article";

interface ArticleFormHighlightedFieldProps {
  control: Control<ArticleFormValues>;
}

export function ArticleFormHighlightedField({
  control,
}: ArticleFormHighlightedFieldProps) {
  return (
    <Controller
      control={control}
      name="highlighted"
      render={({ field }) => (
        <div className="flex items-start gap-3 rounded-lg border border-input bg-muted/15 p-3">
          <Checkbox
            id="highlighted"
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
          />
          <div className="space-y-1">
            <Label htmlFor="highlighted">
              Highlighted
            </Label>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Show this article in the Highlighted section on your company
              profile site.
            </p>
          </div>
        </div>
      )}
    />
  );
}
