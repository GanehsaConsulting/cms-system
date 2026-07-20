"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArticleCategoryBadge } from "@/components/cms/articles/article-category-badge";
import { ArticleCategoryFormDialog } from "@/components/cms/articles/article-category-form-dialog";
import { Button } from "@/components/ui/button";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import type { ArticleCategoryStyle } from "@/config/article-categories";
import { RADIUS_DEEP } from "@/config/shape";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deleteCategoryAction } from "@/lib/actions/categories";
import { isBuiltinArticleCategory } from "@/lib/articles/categories";
import { PencilSimpleIcon, PlusIcon, TrashIcon } from "@/lib/icons";
import { notifyFromActionResult } from "@/lib/notify/action-toast";
import type { CustomArticleCategory } from "@/types/category";
import { cn } from "@/lib/utils";

interface ArticleCategoriesManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: ArticleCategoryStyle[];
  onCategoriesChange: (categories: ArticleCategoryStyle[]) => void;
}

export function ArticleCategoriesManageDialog({
  open,
  onOpenChange,
  categories,
  onCategoriesChange,
}: ArticleCategoriesManageDialogProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CustomArticleCategory | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  const sortedCategories = useMemo(
    () =>
      [...categories].sort((left, right) =>
        left.label.localeCompare(right.label),
      ),
    [categories],
  );

  function handleCreate() {
    setEditingCategory(null);
    setFormOpen(true);
  }

  function handleEdit(category: ArticleCategoryStyle) {
    setEditingCategory({
      id: category.id,
      label: category.label,
      badgeClassName: category.badgeClassName,
      createdAt: "",
    });
    setFormOpen(true);
  }

  function handleSaved(category: CustomArticleCategory) {
    const nextCategory: ArticleCategoryStyle = {
      id: category.id,
      label: category.label,
      badgeClassName: category.badgeClassName,
    };
    const exists = categories.some((item) => item.id === category.id);
    onCategoriesChange(
      exists
        ? categories.map((item) =>
            item.id === category.id ? nextCategory : item,
          )
        : [...categories, nextCategory],
    );
    router.refresh();
  }

  function handleDelete(category: ArticleCategoryStyle) {
    setActionError(null);
    requestConfirm({
      title: "Delete article category?",
      description: `Delete "${category.label}"? This cannot be undone. Categories still used by articles cannot be deleted.`,
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: () => {
        startTransition(async () => {
          const result = await deleteCategoryAction(category.id);
          if (
            !notifyFromActionResult(
              result,
              "Category deleted.",
              "Failed to delete category.",
            )
          ) {
            if (!result.success) {
              setActionError(result.error);
            }
            return;
          }

          onCategoriesChange(
            categories.filter((item) => item.id !== category.id),
          );
          router.refresh();
        });
      },
    });
  }

  return (
    <>
      <CmsDialog open={open} onOpenChange={onOpenChange}>
        <CmsDialogContent showCloseButton size="md" className="flex flex-col">
          <CmsDialogHeader>
            <CmsDialogTitle>Article categories</CmsDialogTitle>
            <CmsDialogDescription>
              Manage custom categories. Built-in categories cannot be edited.
            </CmsDialogDescription>
          </CmsDialogHeader>

          <CmsDialogBody className="flex flex-col gap-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full gap-1.5 bg-primary dark:bg-primary"
              onClick={handleCreate}
            >
              <PlusIcon className="size-3.5" />
              New category
            </Button>

            {actionError ? (
              <p className="text-destructive text-xs" role="alert">
                {actionError}
              </p>
            ) : null}

            {sortedCategories.length === 0 ? (
              <div
                className={cn(
                  RADIUS_DEEP,
                  "border border-dashed border-(--separator) bg-white/30 px-4 py-8 text-center dark:bg-white/8",
                )}
              >
                <p className="font-medium text-sm">No categories yet</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Create a category before assigning articles.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {sortedCategories.map((category) => {
                  const isBuiltin = isBuiltinArticleCategory(category.id);

                  return (
                    <li
                      key={category.id}
                      className={cn(
                        RADIUS_DEEP,
                        "flex items-start justify-between gap-2 bg-white/40 px-3 py-2.5 dark:bg-white/10",
                      )}
                    >
                      <div className="min-w-0 space-y-1">
                        <ArticleCategoryBadge
                          categoryId={category.id}
                          categoryStyle={category}
                        />
                        <p className="truncate font-mono text-muted-foreground text-xs">
                          {category.id}
                          {isBuiltin ? " · built-in" : null}
                        </p>
                      </div>
                      {isBuiltin ? null : (
                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            className="size-8 bg-white/55 dark:bg-secondary"
                            aria-label={`Rename ${category.label}`}
                            onClick={() => handleEdit(category)}
                          >
                            <PencilSimpleIcon className="size-3.5 text-yellow-600 dark:text-yellow-400" />
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon-sm"
                            className="size-8 bg-white/55 text-destructive hover:bg-destructive/15 hover:text-destructive dark:bg-secondary"
                            aria-label={`Delete ${category.label}`}
                            disabled={isPending}
                            onClick={() => handleDelete(category)}
                          >
                            <TrashIcon className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </CmsDialogBody>
        </CmsDialogContent>
      </CmsDialog>

      <ArticleCategoryFormDialog
        open={formOpen}
        onOpenChange={(nextOpen) => {
          setFormOpen(nextOpen);
          if (!nextOpen) {
            setEditingCategory(null);
          }
        }}
        category={editingCategory}
        onSaved={handleSaved}
      />

      {confirmDialog}
    </>
  );
}
