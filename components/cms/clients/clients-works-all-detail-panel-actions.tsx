"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { PencilSimpleIcon, PlusIcon, TrashIcon } from "@/lib/icons";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { Button } from "@/components/ui/button";
import { CLIENT_ACTION_CONFIRMATIONS } from "@/config/client-actions";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deleteClientAction } from "@/lib/actions/clients";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import type { Client } from "@/types/client";

interface ClientsWorksAllDetailPanelActionsProps {
  client: Client;
}

export function ClientsWorksAllDetailPanelActions({
  client,
}: ClientsWorksAllDetailPanelActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleDelete() {
    const confirmation = CLIENT_ACTION_CONFIRMATIONS.delete(client.name);

    requestConfirm({
      ...confirmation,
      onConfirm: () => {
        startTransition(async () => {
          const notified = await runNotifiedAction(
            () => deleteClientAction(client.id),
            {
              success: "Client deleted.",
              errorFallback: "Failed to delete client.",
            },
          );
          if (!notified.ok) return;
          router.refresh();
        });
      },
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5 border-(--separator) border-t p-3">
        <Button
          variant="secondary"
          size="sm"
          className="gap-1 bg-white/45 dark:bg-secondary"
          nativeButton={false}
          render={<Link href={`/clients/${client.id}/edit`} />}
        >
          <PencilSimpleIcon className="size-3.5" />
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1 bg-white/45 dark:bg-secondary"
          nativeButton={false}
          render={
            <Link href={`/clients/portfolio/new?clientId=${client.id}`} />
          }
        >
          <PlusIcon className="size-3.5" />
          Add work
        </Button>
        <CmsDeleteButton
          type="button"
          className="ml-auto"
          disabled={isPending}
          onClick={handleDelete}
        >
          <TrashIcon className="size-3.5" />
          {isPending ? "Deleting..." : "Delete"}
        </CmsDeleteButton>
      </div>

      {confirmDialog}
    </>
  );
}
