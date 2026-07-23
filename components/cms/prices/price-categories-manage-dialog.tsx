"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PencilSimpleIcon, PlusIcon, TrashIcon } from "@/lib/icons";
import { PriceCategoryFormDialog } from "@/components/cms/prices/price-category-form-dialog";
import { Button } from "@/components/ui/button";
import { CmsAlert } from "@/components/shared/cms-alert";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { RADIUS_DEEP } from "@/config/shape";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deletePriceCategoryAction } from "@/lib/actions/price-categories";
import { notifyFromActionResult } from "@/lib/notify/action-toast";
import type { PriceCategory } from "@/types/price-category";
import { cn } from "@/lib/utils";

interface PriceCategoriesManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: PriceCategory[];
  onCategoriesChange: (categories: PriceCategory[]) => void;
}

export function PriceCategoriesManageDialog({
  open,
  onOpenChange,
  categories,
  onCategoriesChange,
}: PriceCategoriesManageDialogProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PriceCategory | null>(
    null,
  );
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

  function handleEdit(category: PriceCategory) {
    setEditingCategory(category);
    setFormOpen(true);
  }

  function handleSaved(category: PriceCategory) {
    const exists = categories.some((item) => item.id === category.id);
    onCategoriesChange(
      exists
        ? categories.map((item) =>
            item.id === category.id ? category : item,
          )
        : [...categories, category],
    );
    router.refresh();
  }

  function handleDelete(category: PriceCategory) {
    setActionError(null);
    requestConfirm({
      title: "Delete service name?",
      description: `Delete "${category.label}"? This cannot be undone. Service names still used by price plans cannot be deleted.`,
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: () => {
        startTransition(async () => {
          const result = await deletePriceCategoryAction(category.id);
          if (
            !notifyFromActionResult(
              result,
              "Service name deleted.",
              "Failed to delete service name.",
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
            <CmsDialogTitle>Service names</CmsDialogTitle>
            <CmsDialogDescription>
              Manage which pricing pages plans can be assigned to.
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
              New service name
            </Button>

            {actionError ? (
              <CmsAlert variant="error" size="sm" message={actionError} />
            ) : null}

            {sortedCategories.length === 0 ? (
              <div
                className={cn(
                  RADIUS_DEEP,
                  "border border-dashed border-(--separator) bg-white/30 px-4 py-8 text-center dark:bg-white/8",
                )}
              >
                <p className="font-medium text-sm">No service names yet</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Create a service name before assigning plans.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {sortedCategories.map((category) => (
                  <li
                    key={category.id}
                    className={cn(
                      RADIUS_DEEP,
                      "flex items-start justify-between gap-2 bg-white/40 px-3 py-2.5 dark:bg-white/10",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm">
                        {category.label}
                      </p>
                      <p className="truncate font-mono text-muted-foreground text-xs">
                        {category.id}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        className="size-8 bg-white/55 dark:bg-secondary"
                        aria-label={`Rename ${category.label}`}
                        onClick={() => handleEdit(category)}
                      >
                        <PencilSimpleIcon className="size-3.5 dark:text-yellow-400 text-yellow-600" />
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
                  </li>
                ))}
              </ul>
            )}
          </CmsDialogBody>
        </CmsDialogContent>
      </CmsDialog>

      <PriceCategoryFormDialog
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
