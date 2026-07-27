"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { CmsListBulkSelectionBar } from "@/components/shared/cms-list-bulk-selection-bar";
import { Button } from "@/components/ui/button";
import { PRICE_ACTION_CONFIRMATIONS } from "@/config/price-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import {
  deletePricesAction,
  setPricesActiveAction,
  setPricesHighlightedAction,
} from "@/lib/actions/prices";
import { CheckIcon, SparkleIcon, TrashIcon } from "@/lib/icons";
import { runNotifiedAction } from "@/lib/notify/action-toast";

interface PricesListBulkBarProps {
  selectedIds: string[];
  onClear: () => void;
}

export function PricesListBulkBar({
  selectedIds,
  onClear,
}: PricesListBulkBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);
  const count = selectedIds.length;

  function runBulk(
    action: () => Promise<unknown>,
    success: string,
    errorFallback: string,
  ) {
    startTransition(async () => {
      const notified = await runNotifiedAction(action, {
        success,
        errorFallback,
      });
      if (!notified.ok) {
        return;
      }
      onClear();
      router.refresh();
    });
  }

  function handleHighlight(highlighted: boolean) {
    runBulk(
      () => setPricesHighlightedAction(selectedIds, highlighted),
      highlighted
        ? count === 1
          ? "Price plan highlighted."
          : `${count} price plans highlighted.`
        : count === 1
          ? "Price plan unhighlighted."
          : `${count} price plans unhighlighted.`,
      "Failed to update price plans.",
    );
  }

  function handleActive(isActive: boolean) {
    runBulk(
      () => setPricesActiveAction(selectedIds, isActive),
      isActive
        ? count === 1
          ? "Price plan set active."
          : `${count} price plans set active.`
        : count === 1
          ? "Price plan set inactive."
          : `${count} price plans set inactive.`,
      "Failed to update price plans.",
    );
  }

  function handleDelete() {
    requestConfirm({
      ...PRICE_ACTION_CONFIRMATIONS.bulkDelete(count),
      onConfirm: () => {
        runBulk(
          () => deletePricesAction(selectedIds),
          count === 1
            ? "Moved to Trash."
            : `${count} price plans moved to Trash.`,
          "Failed to delete price plans.",
        );
      },
    });
  }

  return (
    <>
      <CmsListBulkSelectionBar
        selectedCount={count}
        onClear={onClear}
        disabled={isPending}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          disabled={isPending}
          onClick={() => handleHighlight(true)}
        >
          <SparkleIcon className="size-3.5" />
          Highlight
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          disabled={isPending}
          onClick={() => handleHighlight(false)}
        >
          Unhighlight
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          disabled={isPending}
          onClick={() => handleActive(true)}
        >
          Active
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          disabled={isPending}
          onClick={() => handleActive(false)}
        >
          Inactive
        </Button>
        <CmsDeleteButton
          type="button"
          className="h-8"
          disabled={isPending}
          onClick={handleDelete}
        >
          <TrashIcon className="size-3.5" />
          Delete
        </CmsDeleteButton>
      </CmsListBulkSelectionBar>

      {confirmDialog}
    </>
  );
}
