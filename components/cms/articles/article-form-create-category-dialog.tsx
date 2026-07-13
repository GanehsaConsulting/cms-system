"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ARTICLE_FORM_LIMITS } from "@/config/article-form";
import { createCategoryAction } from "@/lib/actions/categories";
import { slugify } from "@/lib/articles/slug";
import type { CustomArticleCategory } from "@/types/category";

interface ArticleFormCreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (category: CustomArticleCategory) => void;
}

export function ArticleFormCreateCategoryDialog({
  open,
  onOpenChange,
  onCreated,
}: ArticleFormCreateCategoryDialogProps) {
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const previewId = slugify(label);

  function resetForm() {
    setLabel("");
    setError(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }

    if (!nextOpen) {
      resetForm();
    }

    onOpenChange(nextOpen);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("label", label);

    startTransition(async () => {
      const result = await createCategoryAction(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      onCreated(result.category);
      resetForm();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isPending} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a category for organizing articles on your company profile site.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-label">Category name</Label>
            <Input
              id="category-label"
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || label.trim().length < 2}>
              {isPending ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
