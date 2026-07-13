"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ArticleFormAuthorField } from "@/components/cms/articles/article-form-author-field";
import { ArticleFormCategoryField } from "@/components/cms/articles/article-form-category-field";
import { ArticleFormHighlightedField } from "@/components/cms/articles/article-form-highlighted-field";
import { ArticleFormTagsField } from "@/components/cms/articles/article-form-tags-field";
import { ArticleStatusBadge } from "@/components/cms/articles/article-status-badge";
import { CmsFormSectionHeading } from "@/components/shared/cms-form-section-heading";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { ArticleCategoryStyle } from "@/config/article-categories";
import type { ArticleFormValues } from "@/lib/validations/article";
import type { CustomArticleCategory } from "@/types/category";

interface ArticleFormPublicationPanelProps {
  control: Control<ArticleFormValues>;
  tagsError?: string;
  categories: ArticleCategoryStyle[];
  allowCreateCategory?: boolean;
  onCategoriesChange: (categories: ArticleCategoryStyle[]) => void;
  onCategoryCreated: (category: CustomArticleCategory) => void;
}

export function ArticleFormPublicationPanel({
  control,
  tagsError,
  categories,
  allowCreateCategory = false,
  onCategoriesChange,
  onCategoryCreated,
}: ArticleFormPublicationPanelProps) {
  return (
    <SolidSurface className="space-y-4 p-4">
      <CmsFormSectionHeading
        title="Publication"
        description="Status, taxonomy, and author for the public article."
        accent="publication"
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="w-full">
                  <ArticleStatusBadge status={field.value} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    <ArticleStatusBadge status="draft" />
                  </SelectItem>
                  <SelectItem value="published">
                    <ArticleStatusBadge status="published" />
                  </SelectItem>
                  <SelectItem value="archived">
                    <ArticleStatusBadge status="archived" />
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <ArticleFormHighlightedField control={control} />

        <ArticleFormCategoryField
          control={control}
          categories={categories}
          allowCreate={allowCreateCategory}
          onCategoriesChange={onCategoriesChange}
          onCategoryCreated={onCategoryCreated}
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

        <ArticleFormAuthorField control={control} />
      </div>
    </SolidSurface>
  );
}
