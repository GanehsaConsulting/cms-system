"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CmsAlert } from "@/components/shared/cms-alert";
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
import { PRICE_CATEGORY_LIMITS } from "@/config/price-category";
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import {
  createPriceCategoryAction,
  updatePriceCategoryAction,
} from "@/lib/actions/price-categories";
import { slugify } from "@/lib/articles/slug";
import { notifyError, notifySuccess } from "@/lib/notify/action-toast";
import type { PriceCategory } from "@/types/price-category";

interface PriceCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: PriceCategory | null;
  onSaved: (category: PriceCategory) => void;
}

export function PriceCategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: PriceCategoryFormDialogProps) {
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
        ? await updatePriceCategoryAction(category.id, formData)
        : await createPriceCategoryAction(formData);

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
            {isEdit ? "Rename category" : "Create price category"}
          </CmsDialogTitle>
          <CmsDialogDescription>
            {isEdit
              ? "Update the display name. Plans already using this category stay linked."
              : "Categories group pricing cards onto public service pages."}
          </CmsDialogDescription>
        </CmsDialogHeader>

        <form onSubmit={handleSubmit} className={DIALOG_FORM_CLASS}>
          <CmsDialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price-category-label">Category name</Label>
              <Input
                id="price-category-label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="e.g. Virtual Office"
                maxLength={PRICE_CATEGORY_LIMITS.label}
                disabled={isPending}
                autoFocus
              />
              {previewId ? (
                <p className="text-muted-foreground text-xs">
                  ID: <span className="font-mono">{previewId}</span>
                </p>
              ) : null}
              {error ? (
                <CmsAlert variant="error" size="sm" message={error} />
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
