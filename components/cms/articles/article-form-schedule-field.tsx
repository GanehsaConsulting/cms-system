"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ArticleFormField } from "@/components/cms/articles/article-form-field";
import { Input } from "@/components/ui/input";
import type { ArticleFormValues } from "@/lib/validations/article";

interface ArticleFormScheduleFieldProps {
  control: Control<ArticleFormValues>;
  error?: string;
}

export function ArticleFormScheduleField({
  control,
  error,
}: ArticleFormScheduleFieldProps) {
  return (
    <Controller
      control={control}
      name="scheduledAt"
      render={({ field }) => (
        <ArticleFormField
          id="scheduledAt"
          label="Publish date & time"
          required
          error={error}
          hint="The article stays private until this time, then publishes automatically. Use Publish in the header to go live immediately."
        >
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            aria-invalid={Boolean(error)}
            className="w-full"
          />
        </ArticleFormField>
      )}
    />
  );
}
