"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ArticleFormAuthorField } from "@/components/cms/articles/article-form-author-field";
import { ArticleFormCategoryField } from "@/components/cms/articles/article-form-category-field";
import { ArticleFormHighlightedField } from "@/components/cms/articles/article-form-highlighted-field";
import { ArticleFormTagsField } from "@/components/cms/articles/article-form-tags-field";
import { ArticleStatusBadge } from "@/components/cms/articles/article-status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { GlassSurface } from "@/components/shared/glass-surface";
import type { ArticleCategoryStyle } from "@/config/article-categories";
import { formatArticleDate } from "@/lib/articles/list";
import type { ArticleFormValues } from "@/lib/validations/article";
import type { Article } from "@/types/article";
import type { CustomArticleCategory } from "@/types/category";

interface ArticleFormPublicationPanelProps {
  control: Control<ArticleFormValues>;
  tagsError?: string;
  article?: Article;
  categories: ArticleCategoryStyle[];
  allowCreateCategory?: boolean;
  onCategoriesChange: (categories: ArticleCategoryStyle[]) => void;
  onCategoryCreated: (category: CustomArticleCategory) => void;
}

export function ArticleFormPublicationPanel({
  control,
  tagsError,
  article,
  categories,
  allowCreateCategory = false,
  onCategoriesChange,
  onCategoryCreated,
}: ArticleFormPublicationPanelProps) {
  return (
    <GlassSurface className="p-4">
      <h2 className="font-semibold text-sm">Publication</h2>

      <div className="mt-4 space-y-4">
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

        {article ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="updated-at">Updated</Label>
              <Input
                id="updated-at"
                readOnly
                value={formatArticleDate(article.updatedAt)}
                className="bg-muted/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="created-at">Created</Label>
              <Input
                id="created-at"
                readOnly
                value={formatArticleDate(article.createdAt)}
                className="bg-muted/20"
              />
            </div>
          </>
        ) : null}
      </div>
    </GlassSurface>
  );
}
