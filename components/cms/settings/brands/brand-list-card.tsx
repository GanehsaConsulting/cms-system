"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { BrandStatusBadge } from "@/components/cms/settings/brands/brand-status-badge";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getBrandFeatureLabel } from "@/config/brand";
import { RADIUS_DEEP } from "@/config/shape";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { deleteBrandAction } from "@/lib/actions/brands";
import { formatClientDateParts } from "@/lib/clients/list";
import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from "@/lib/icons";
import { notifyFromActionResult } from "@/lib/notify/action-toast";
import type { Brand } from "@/types/brand";
import { cn } from "@/lib/utils";

interface BrandListCardProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
}

export function BrandListCard({ brand, onEdit }: BrandListCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isPending);
  const updated = formatClientDateParts(brand.updatedAt);

  function handleDelete() {
    requestConfirm({
      title: `Delete ${brand.name}?`,
      description:
        "This brand will be removed from the CMS. User assignments for this brand will need to be updated separately.",
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: () => {
        startTransition(async () => {
          const result = await deleteBrandAction(brand.id);
          if (!notifyFromActionResult(result, "Brand deleted.")) return;
          router.refresh();
        });
      },
    });
  }

  return (
    <>
      <SolidSurface className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                RADIUS_DEEP,
                "relative flex size-11 shrink-0 items-center justify-center overflow-hidden bg-muted",
              )}
            >
              {brand.logo ? (
                <Image
                  src={brand.logo}
                  alt=""
                  fill
                  unoptimized
                  className="object-contain p-1.5"
                />
              ) : (
                <span className="font-semibold text-muted-foreground text-sm">
                  {brand.name.slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-sm leading-snug">
                {brand.name}
              </h3>
              <p className="truncate text-muted-foreground text-xs">
                {brand.slug}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 shrink-0"
                  aria-label="Brand actions"
                />
              }
            >
              <DotsThreeIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(brand)}>
                <PencilSimpleIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={isPending}
                onClick={handleDelete}
              >
                <TrashIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BrandStatusBadge status={brand.status} />
          <span className="text-muted-foreground text-xs">
            Updated {updated.date}
          </span>
        </div>

        {brand.description ? (
          <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
            {brand.description}
          </p>
        ) : null}

        <div className="mt-auto space-y-2">
          <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
            Enabled modules
          </p>
          <div className="flex flex-wrap gap-1.5">
            {brand.features.map((featureId) => (
              <span
                key={featureId}
                className="rounded-md bg-primary/8 px-2 py-0.5 text-[11px] text-foreground"
              >
                {getBrandFeatureLabel(featureId)}
              </span>
            ))}
          </div>
        </div>
      </SolidSurface>

      {confirmDialog}
    </>
  );
}
