"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { CmsListBulkSelectionBar } from "@/components/shared/cms-list-bulk-selection-bar";
import { Button } from "@/components/ui/button";
import { CLIENT_ACTION_CONFIRMATIONS } from "@/config/client-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import {
  deleteClientsAction,
  setClientsFeaturedAction,
} from "@/lib/actions/clients";
import { SparkleIcon, TrashIcon } from "@/lib/icons";
import { runNotifiedAction } from "@/lib/notify/action-toast";

interface ClientsListBulkBarProps {
  selectedIds: string[];
  onClear: () => void;
}

export function ClientsListBulkBar({
  selectedIds,
  onClear,
}: ClientsListBulkBarProps) {
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

  function handleFeature(featured: boolean) {
    runBulk(
      () => setClientsFeaturedAction(selectedIds, featured),
      featured
        ? count === 1
          ? "Client featured."
          : `${count} clients featured.`
        : count === 1
          ? "Client unfeatured."
          : `${count} clients unfeatured.`,
      "Failed to update clients.",
    );
  }

  function handleDelete() {
    requestConfirm({
      ...CLIENT_ACTION_CONFIRMATIONS.bulkDelete(count),
      onConfirm: () => {
        runBulk(
          () => deleteClientsAction(selectedIds),
          count === 1 ? "Moved to Trash." : `${count} clients moved to Trash.`,
          "Failed to delete clients.",
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
          onClick={() => handleFeature(true)}
        >
          <SparkleIcon className="size-3.5" />
          Feature
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          disabled={isPending}
          onClick={() => handleFeature(false)}
        >
          Unfeature
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
