"use client";

import type { Control } from "react-hook-form";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ArticleFormAuthorField } from "@/components/cms/articles/article-form-author-field";
import { ArticleFormCategoryField } from "@/components/cms/articles/article-form-category-field";
import { ArticleFormHighlightedField } from "@/components/cms/articles/article-form-highlighted-field";
import { ArticleFormScheduleField } from "@/components/cms/articles/article-form-schedule-field";
import { ArticleFormTagsField } from "@/components/cms/articles/article-form-tags-field";
import { ArticleStatusBadge } from "@/components/cms/articles/article-status-badge";
import { CmsFormSectionHeading } from "@/components/shared/cms-form-section-heading";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ArticleCategoryStyle } from "@/config/article-categories";
import type { ArticleAuthorOption } from "@/lib/articles/authors";
import { getDefaultScheduleDatetimeLocal } from "@/lib/articles/schedule";
import type { ArticleFormValues } from "@/lib/validations/article";

interface ArticleFormPublicationPanelProps {
  control: Control<ArticleFormValues>;
  tagsError?: string;
  scheduledAtError?: string;
  categories: ArticleCategoryStyle[];
  currentAuthor: ArticleAuthorOption;
  onCategoriesChange: (categories: ArticleCategoryStyle[]) => void;
}

export function ArticleFormPublicationPanel({
  control,
  tagsError,
  scheduledAtError,
  categories,
  currentAuthor,
  onCategoriesChange,
}: ArticleFormPublicationPanelProps) {
  const { setValue } = useFormContext<ArticleFormValues>();
  const status = useWatch({ control, name: "status" });
  const scheduledAt = useWatch({ control, name: "scheduledAt" });
  const isScheduling = status === "scheduled";

  function handleScheduleToggle(enabled: boolean) {
    if (enabled) {
      setValue("status", "scheduled", {
        shouldDirty: true,
        shouldValidate: true,
      });
      if (!scheduledAt.trim()) {
        setValue("scheduledAt", getDefaultScheduleDatetimeLocal(), {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      return;
    }

    if (status !== "scheduled") {
      return;
    }

    setValue("status", "draft", { shouldDirty: true, shouldValidate: true });
    setValue("scheduledAt", "", { shouldDirty: true, shouldValidate: true });
  }

  return (
    <SolidSurface className="space-y-4 p-4">
      <CmsFormSectionHeading
        title="Publication"
        description="Schedule go-live, taxonomy, and author. Use Save Draft or Publish in the header to choose how this article is saved."
        descriptionAsTooltip
        accent="publication"
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
          <div className="min-w-0 space-y-0.5">
            <p className="font-medium text-sm">Current status</p>
          </div>
          <ArticleStatusBadge status={status} className="shrink-0" />
        </div>

        <div className="space-y-3 rounded-lg border border-border/60 px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <Label htmlFor="schedule-toggle" className="font-medium text-sm">
                Schedule for later
              </Label>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Keep this off while drafting. Turn on only when you want a
                future publish time.
              </p>
            </div>
            <Switch
              id="schedule-toggle"
              checked={isScheduling}
              onCheckedChange={(checked) =>
                handleScheduleToggle(checked === true)
              }
              aria-label="Schedule for later"
            />
          </div>

          {isScheduling ? (
            <ArticleFormScheduleField
              control={control}
              error={scheduledAtError}
            />
          ) : null}
        </div>

        <ArticleFormHighlightedField control={control} />

        <ArticleFormCategoryField
          control={control}
          categories={categories}
          onCategoriesChange={onCategoriesChange}
        />

        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <ArticleFormTagsField
              value={field.value}
              onChange={field.onChange}
              error={tagsError}
            />
          )}
        />

        <ArticleFormAuthorField control={control} author={currentAuthor} />
      </div>
    </SolidSurface>
  );
}
