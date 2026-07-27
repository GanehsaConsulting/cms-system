"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { Button } from "@/components/ui/button";
import { TRASH_ACTION_CONFIRMATIONS } from "@/config/trash";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import {
  purgeTrashItemsAction,
  restoreTrashItemsAction,
} from "@/lib/actions/trash";
import { ArrowCounterclockwiseIcon, TrashIcon } from "@/lib/icons";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import {
  parseTrashItemKey,
  type TrashItemRef,
} from "@/types/trash";

interface TrashListBulkBarProps {
  selectedKeys: string[];
  canPurgePermanently?: boolean;
  onClear: () => void;
}

/** Footer bulk bar — always visible; actions enable when selection is non-empty. */
export function TrashListBulkBar({
  selectedKeys,
  canPurgePermanently = false,
  onClear,
}: TrashListBulkBarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);
  const count = selectedKeys.length;
  const hasSelection = count > 0;

  function selectedItems(): TrashItemRef[] {
    return selectedKeys
      .map(parseTrashItemKey)
      .filter((item): item is TrashItemRef => item !== null);
  }

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

  function handleRestore() {
    if (!hasSelection) {
      return;
    }
    const items = selectedItems();
    requestConfirm({
      ...TRASH_ACTION_CONFIRMATIONS.bulkRestore(count),
      onConfirm: () => {
        runBulk(
          () => restoreTrashItemsAction(items),
          count === 1 ? "Item restored." : `${count} items restored.`,
          "Failed to restore items.",
        );
      },
    });
  }

  function handlePurge() {
    if (!hasSelection) {
      return;
    }
    const items = selectedItems();
    requestConfirm({
      ...TRASH_ACTION_CONFIRMATIONS.bulkPurge(count),
      onConfirm: () => {
        runBulk(
          () => purgeTrashItemsAction(items),
          count === 1
            ? "Item deleted forever."
            : `${count} items deleted forever.`,
          "Failed to permanently delete items.",
        );
      },
    });
  }

  return (
    <>
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-(--separator) border-t px-4 py-2.5">
        <p className="mr-auto text-muted-foreground text-sm tabular-nums">
          {count === 1 ? "1 item selected" : `${count} items selected`}
        </p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          disabled={!hasSelection || isPending}
          onClick={handleRestore}
        >
          <ArrowCounterclockwiseIcon className="size-3.5" />
          Restore selected
        </Button>
        {canPurgePermanently ? (
          <CmsDeleteButton
            type="button"
            className="h-8"
            disabled={!hasSelection || isPending}
            onClick={handlePurge}
          >
            <TrashIcon className="size-3.5" />
            Delete selected
          </CmsDeleteButton>
        ) : null}
      </div>

      {confirmDialog}
    </>
  );
}
