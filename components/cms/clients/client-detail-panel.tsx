"use client";

import Image from "next/image";
import { ClientDetailPanelActions } from "@/components/cms/clients/client-detail-panel-actions";
import { ClientDetailPhotosPreview } from "@/components/cms/clients/client-detail-photos-preview";
import { ClientDetailTabDetail } from "@/components/cms/clients/client-detail-tab-detail";
import { ClientFeaturedBadge } from "@/components/cms/clients/client-featured-badge";
import { ActivityLogPanel } from "@/components/shared/activity-log-panel";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { Button } from "@/components/ui/button";
import { RADIUS_DEEP } from "@/config/shape";
import { isCompanyLogoIcon } from "@/lib/clients/logo";
import {
  type ClientListPreviewMode,
  getClientListPreview,
} from "@/lib/clients/preview";
import { XIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Client } from "@/types/client";

interface ClientDetailPanelProps {
  client: Client;
  previewMode?: ClientListPreviewMode;
  onClose: () => void;
}

export function ClientDetailPanel({
  client,
  previewMode = "auto",
  onClose,
}: ClientDetailPanelProps) {
  const { openPreview } = useCmsImagePreview();
  const preview = getClientListPreview(client, previewMode);
  const marqueeReady =
    previewMode !== "photo" && isCompanyLogoIcon(client.logo);
  const previewAriaLabel =
    previewMode === "photo" ? "Preview client photo" : "Preview logo";

  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-(--separator) border-b p-4">
        <div className="flex min-w-0 items-start gap-3">
          {preview.url ? (
            <button
              type="button"
              aria-label={previewAriaLabel}
              onClick={() =>
                openPreview({
                  images: preview.previewImages,
                  title: preview.previewTitle,
                })
              }
              className={cn(
                RADIUS_DEEP,
                "relative flex size-11 shrink-0 items-center justify-center overflow-hidden bg-white/45 dark:bg-white/10",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              )}
            >
              <Image
                src={preview.url}
                alt=""
                fill
                unoptimized
                className={
                  preview.fit === "contain"
                    ? "object-contain p-1.5"
                    : "object-cover"
                }
              />
            </button>
          ) : (
            <div
              className={cn(
                RADIUS_DEEP,
                "relative flex size-11 shrink-0 items-center justify-center overflow-hidden bg-white/45 dark:bg-white/10",
              )}
            >
              <span className="font-medium text-muted-foreground text-sm">
                {client.name.slice(0, 1).toUpperCase() || "?"}
              </span>
            </div>
          )}
          <div className="min-w-0 space-y-2">
            <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
              Detail
            </p>
            <h2 className="line-clamp-2 font-semibold text-sm leading-snug">
              {client.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <ClientFeaturedBadge featured={client.featured} />
              {marqueeReady ? (
                <span className="rounded-md bg-sky-500/15 px-1.5 py-0.5 font-medium text-[10px] text-sky-700 dark:text-sky-300">
                  Marquee
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="size-8 shrink-0 bg-white/45 dark:bg-secondary"
          aria-label="Close panel"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {previewMode === "photo" ? (
          <ClientDetailPhotosPreview
            images={preview.previewImages}
            title={client.name}
          />
        ) : null}
        <ClientDetailTabDetail client={client} previewMode={previewMode} />
        <ActivityLogPanel
          entityType="client"
          entityId={client.id}
          className="mt-6"
        />
      </div>

      <ClientDetailPanelActions client={client} />
    </aside>
  );
}
