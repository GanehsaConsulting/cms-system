"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deleteUserAction } from "@/lib/actions/users";
import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import type { User } from "@/types/user";

interface UserRowActionsMenuProps {
  user: User;
  onEdit: (user: User) => void;
}

export function UserRowActionsMenu({ user, onEdit }: UserRowActionsMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);

  function handleDelete() {
    requestConfirm({
      title: `Delete ${user.name}?`,
      description:
        "This user will lose access to the CMS. You can recreate their account later if needed.",
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: () => {
        startTransition(async () => {
          const result = await deleteUserAction(user.id);
          if (!result.success) {
            return;
          }
          router.refresh();
        });
      },
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-8"
              aria-label="User actions"
              onClick={(event) => event.stopPropagation()}
            />
          }
        >
          <DotsThreeIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onEdit(user);
            }}
          >
            <PencilSimpleIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onClick={(event) => {
              event.stopPropagation();
              handleDelete();
            }}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {confirmDialog}
    </>
  );
}
