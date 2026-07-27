"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { TRASH_ACTION_CONFIRMATIONS } from "@/config/trash";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { emptyTrashAction } from "@/lib/actions/trash";
import { TrashIcon } from "@/lib/icons";
import { runNotifiedAction } from "@/lib/notify/action-toast";

export function TrashEmptyButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleEmpty() {
    requestConfirm({
      ...TRASH_ACTION_CONFIRMATIONS.emptyTrash,
      onConfirm: () => {
        startTransition(async () => {
          const notified = await runNotifiedAction(() => emptyTrashAction(), {
            success: "Trash emptied.",
            errorFallback: "Failed to empty Trash.",
          });
          if (!notified.ok) {
            return;
          }
          router.refresh();
        });
      },
    });
  }

  return (
    <>
      <CmsDeleteButton
        type="button"
        className="h-9"
        disabled={isPending}
        onClick={handleEmpty}
      >
        <TrashIcon className="size-3.5" />
        Empty Trash
      </CmsDeleteButton>
      {confirmDialog}
    </>
  );
}
