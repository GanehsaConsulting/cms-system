"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ARTICLE_FORM_LIMITS } from "@/config/article-form";
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/actions/categories";
import { slugify } from "@/lib/articles/slug";
import { notifyError, notifySuccess } from "@/lib/notify/action-toast";
import type { CustomArticleCategory } from "@/types/category";

interface ArticleCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CustomArticleCategory | null;
  onSaved: (category: CustomArticleCategory) => void;
}

export function ArticleCategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: ArticleCategoryFormDialogProps) {
  const isEdit = Boolean(category);
  const [label, setLabel] = useState(category?.label ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const previewId = isEdit ? category?.id ?? "" : slugify(label);

  function resetForm() {
    setLabel(category?.label ?? "");
    setError(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }

    if (!nextOpen) {
      resetForm();
    } else {
      setLabel(category?.label ?? "");
      setError(null);
    }

    onOpenChange(nextOpen);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("label", label);

    startTransition(async () => {
      const result = category
        ? await updateCategoryAction(category.id, formData)
        : await createCategoryAction(formData);

      if (!result.success) {
        notifyError(result.error || "Failed to save category.");
        setError(result.error);
        return;
      }

      notifySuccess(category ? "Category saved." : "Category created.");
      onSaved(result.category);
      resetForm();
      onOpenChange(false);
    });
  }

  return (
    <CmsDialog open={open} onOpenChange={handleOpenChange}>
      <CmsDialogContent showCloseButton={!isPending} size="sm">
        <CmsDialogHeader>
          <CmsDialogTitle>
            {isEdit ? "Rename category" : "Create article category"}
          </CmsDialogTitle>
          <CmsDialogDescription>
            {isEdit
              ? "Update the display name. Articles already using this category stay linked."
              : "Categories group articles on your company profile site."}
          </CmsDialogDescription>
        </CmsDialogHeader>

        <form onSubmit={handleSubmit} className={DIALOG_FORM_CLASS}>
          <CmsDialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="article-category-label">Category name</Label>
              <Input
                id="article-category-label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="e.g. Product Updates"
                maxLength={ARTICLE_FORM_LIMITS.categoryLabel}
                disabled={isPending}
                autoFocus
              />
              {previewId ? (
                <p className="text-muted-foreground text-xs">
                  ID: <span className="font-mono">{previewId}</span>
                </p>
              ) : null}
              {error ? (
                <p className="text-destructive text-xs">{error}</p>
              ) : null}
            </div>
          </CmsDialogBody>

          <CmsDialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || label.trim().length < 2}
            >
              {isPending
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create category"}
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
