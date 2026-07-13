"use client";

import { Button } from "@/components/ui/button";
import {
  CmsDialog,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  isPending?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  variant = "default",
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) {
  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }

    onOpenChange(nextOpen);
  }

  return (
    <CmsDialog open={open} onOpenChange={handleOpenChange}>
      <CmsDialogContent showCloseButton={!isPending} size="sm">
        <CmsDialogHeader>
          <CmsDialogTitle>{title}</CmsDialogTitle>
          <CmsDialogDescription>{description}</CmsDialogDescription>
        </CmsDialogHeader>

        <CmsDialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === "destructive" ? "destructive" : "default"}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Working..." : confirmLabel}
          </Button>
        </CmsDialogFooter>
      </CmsDialogContent>
    </CmsDialog>
  );
}
