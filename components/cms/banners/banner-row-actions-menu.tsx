"use client";

import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
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
import { BANNER_ACTION_CONFIRMATIONS } from "@/config/banner-actions";
import { isRequiredBannerPlacementKey } from "@/config/banner-placements";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deleteBannerAction } from "@/lib/actions/banners";
import { notifyFromActionResult } from "@/lib/notify/action-toast";
import type { Banner } from "@/types/banner";

interface BannerRowActionsMenuProps {
  banner: Banner;
  onEdit: (banner: Banner) => void;
}

export function BannerRowActionsMenu({
  banner,
  onEdit,
}: BannerRowActionsMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);
  const canDelete = !isRequiredBannerPlacementKey(banner.key);

  function handleDelete() {
    const confirmation = BANNER_ACTION_CONFIRMATIONS.delete(banner.name);

    requestConfirm({
      ...confirmation,
      onConfirm: () => {
        startTransition(async () => {
          const result = await deleteBannerAction(banner.id);
          if (!notifyFromActionResult(result, "Banner deleted.")) return;
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
              aria-label="Banner actions"
              onClick={(event) => event.stopPropagation()}
            />
          }
        >
          <DotsThreeIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation();
              onEdit(banner);
            }}
          >
            <PencilSimpleIcon />
            Edit
          </DropdownMenuItem>
          {canDelete ? (
            <>
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
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      {confirmDialog}
    </>
  );
}
