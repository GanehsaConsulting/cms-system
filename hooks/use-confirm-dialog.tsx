"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface ConfirmDialogOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
}

export function useConfirmDialog(isPending = false) {
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null);

  function requestConfirm(nextOptions: ConfirmDialogOptions) {
    setOptions(nextOptions);
  }

  function closeConfirm() {
    if (isPending) {
      return;
    }

    setOptions(null);
  }

  const confirmDialog = options ? (
    <ConfirmDialog
      open
      onOpenChange={(open) => {
        if (!open) {
          closeConfirm();
        }
      }}
      title={options.title}
      description={options.description}
      confirmLabel={options.confirmLabel}
      cancelLabel={options.cancelLabel}
      variant={options.variant}
      isPending={isPending}
      onConfirm={() => {
        options.onConfirm();
        closeConfirm();
      }}
    />
  ) : null;

  return {
    requestConfirm,
    closeConfirm,
    confirmDialog,
  };
}
