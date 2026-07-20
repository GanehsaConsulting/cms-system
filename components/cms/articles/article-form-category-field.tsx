"use client";

import { useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ArticleCategoryBadge } from "@/components/cms/articles/article-category-badge";
import { ArticleCategoryFormDialog } from "@/components/cms/articles/article-category-form-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { ArticleCategoryStyle } from "@/config/article-categories";
import { findArticleCategory } from "@/lib/articles/categories";
import { PlusIcon } from "@/lib/icons";
import type { ArticleFormValues } from "@/lib/validations/article";

interface ArticleFormCategoryFieldProps {
  control: Control<ArticleFormValues>;
  categories: ArticleCategoryStyle[];
  onCategoriesChange: (categories: ArticleCategoryStyle[]) => void;
}

export function ArticleFormCategoryField({
  control,
  categories,
  onCategoriesChange,
}: ArticleFormCategoryFieldProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="category">Category</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={() => setCreateOpen(true)}
        >
          <PlusIcon className="size-3" />
          New
        </Button>
      </div>
      <Controller
        control={control}
        name="category"
        render={({ field, fieldState }) => {
          const selectedCategory = findArticleCategory(
            field.value,
            categories,
          );

          return (
            <div className="space-y-1.5">
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
              {fieldState.error ? (
                <p className="text-destructive text-xs">
                  {fieldState.error.message}
                </p>
              ) : null}

              <ArticleCategoryFormDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSaved={(category) => {
                  const nextCategory: ArticleCategoryStyle = {
                    id: category.id,
                    label: category.label,
                    badgeClassName: category.badgeClassName,
                  };
                  onCategoriesChange([...categories, nextCategory]);
                  field.onChange(category.id);
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
