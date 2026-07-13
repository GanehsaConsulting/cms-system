"use client";

import { useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ArticleCategoryBadge } from "@/components/cms/articles/article-category-badge";
import { ArticleFormCreateCategoryDialog } from "@/components/cms/articles/article-form-create-category-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { ArticleCategoryStyle } from "@/config/article-categories";
import { findArticleCategory } from "@/lib/articles/categories";
import type { ArticleFormValues } from "@/lib/validations/article";
import type { CustomArticleCategory } from "@/types/category";

interface ArticleFormCategoryFieldProps {
  control: Control<ArticleFormValues>;
  categories: ArticleCategoryStyle[];
  allowCreate?: boolean;
  onCategoriesChange: (categories: ArticleCategoryStyle[]) => void;
  onCategoryCreated: (category: CustomArticleCategory) => void;
}

export function ArticleFormCategoryField({
  control,
  categories,
  allowCreate = false,
  onCategoriesChange,
  onCategoryCreated,
}: ArticleFormCategoryFieldProps) {
  const [createOpen, setCreateOpen] = useState(false);

  function handleCategoryCreated(category: CustomArticleCategory) {
    const nextCategory: ArticleCategoryStyle = {
      id: category.id,
      label: category.label,
      badgeClassName: category.badgeClassName,
    };

    onCategoriesChange([...categories, nextCategory]);
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => {
            const selectedCategory = findArticleCategory(
              field.value,
              categories,
            );

            return (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="category" className="w-full">
                <ArticleCategoryBadge
                  categoryId={field.value}
                  categoryStyle={selectedCategory}
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <ArticleCategoryBadge
                      categoryId={category.id}
                      categoryStyle={category}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            );
          }}
        />

        {allowCreate ? (
          <button
            type="button"
            className="text-primary text-xs hover:underline"
            onClick={() => setCreateOpen(true)}
          >
            + Create New Category
          </button>
        ) : null}
      </div>

      {allowCreate ? (
        <ArticleFormCreateCategoryDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={(category) => {
            handleCategoryCreated(category);
            onCategoryCreated(category);
          }}
        />
      ) : null}
    </>
  );
}
