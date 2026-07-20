"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { CmsDetailMetaRow } from "@/components/shared/cms-detail-meta-row";
import { MediaLibraryKindBadge } from "@/components/cms/media/media-library-kind-badge";
import { MediaLibraryKindIcon } from "@/components/cms/media/media-library-kind-icon";
import { DocumentationCopyButton } from "@/components/cms/settings/documentation/documentation-copy-button";
import { Button } from "@/components/ui/button";
import { RADIUS_DEEP } from "@/config/shape";
import { formatClientDateParts } from "@/lib/clients/list";
import { isRenderableMediaPreview } from "@/lib/media/classify";
import {
  formatMediaKindLabel,
  formatMediaUsageFieldLabel,
  getMediaSourceHref,
} from "@/lib/media/list";
import { resolveMediaPublicUrl } from "@/lib/media/public-url";
import { ArrowUpRightIcon } from "@/lib/icons";
import type { MediaAsset } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryInUseDetailDialogProps {
  asset: MediaAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MediaUsageList({ asset }: { asset: MediaAsset }) {
  return (
    <ul className="divide-y divide-(--separator) rounded-(--radius-inner) border border-(--separator)">
      {asset.usages.map((usage) => {
        const cmsHref = getMediaSourceHref(usage);
        const updated = formatClientDateParts(usage.updatedAt);

        return (
          <li
            key={`${usage.source}-${usage.entityId}-${usage.fieldPath}`}
            className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <p className="font-medium text-sm">{usage.entityTitle}</p>
              <p className="text-muted-foreground text-xs">
                {usage.sourceLabel} · {formatMediaUsageFieldLabel(usage.fieldPath)}
              </p>
              {usage.caption ? (
                <p className="text-muted-foreground text-xs">{usage.caption}</p>
              ) : null}
              <p className="text-muted-foreground text-xs">
                Updated {updated.date} · {updated.time}
              </p>
            </div>

            {cmsHref ? (
              <Button
                nativeButton={false}
                variant="outline"
                size="sm"
                className="shrink-0"
                render={<Link href={cmsHref} />}
              >
                Open in CMS
              </Button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function MediaLibraryInUseDetailDialog({
  asset,
  open,
  onOpenChange,
}: MediaLibraryInUseDetailDialogProps) {
  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      {asset ? (
        <MediaLibraryInUseDetailContent asset={asset} onOpenChange={onOpenChange} />
      ) : null}
    </CmsDialog>
  );
}

function MediaLibraryInUseDetailContent({
  asset,
  onOpenChange,
}: {
  asset: MediaAsset;
  onOpenChange: (open: boolean) => void;
}) {
  const publicUrl = resolveMediaPublicUrl(asset.url);
  const updated = formatClientDateParts(asset.updatedAt);
  const canPreviewImage = isRenderableMediaPreview(asset.kind);
  const canPreviewVideo = asset.kind === "video";

  return (
    <CmsDialogContent size="lg">
        <CmsDialogHeader>
          <CmsDialogTitle className="truncate pr-6">{asset.filename}</CmsDialogTitle>
          <CmsDialogDescription>
            Used in {asset.usages.length}{" "}
            {asset.usages.length === 1 ? "place" : "places"} across CMS modules.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <CmsDialogBody className="space-y-5">
          <div
            className={cn(
              RADIUS_DEEP,
              "relative aspect-video overflow-hidden bg-muted",
            )}
          >
            {canPreviewImage ? (
              <Image
                src={asset.url}
                alt=""
                fill
                unoptimized
                className="object-contain"
              />
            ) : canPreviewVideo ? (
              <video
                src={asset.url}
                controls
                className="size-full object-contain"
              >
                <track kind="captions" />
              </video>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <MediaLibraryKindIcon kind={asset.kind} className="size-10 opacity-60" />
                <p className="text-xs">Preview not available</p>
              </div>
            )}
          </div>

          <dl className="overflow-hidden rounded-(--radius-inner) border border-(--separator)">
            <CmsDetailMetaRow label="Type">
              <MediaLibraryKindBadge kind={asset.kind} />
            </CmsDetailMetaRow>
            <CmsDetailMetaRow label="Format">
              {asset.mimeType ?? formatMediaKindLabel(asset.kind)}
            </CmsDetailMetaRow>
            <CmsDetailMetaRow label="Last updated">
              {updated.date} · {updated.time}
            </CmsDetailMetaRow>
            <CmsDetailMetaRow label="Public URL" stacked showDivider={false}>
              <div className="space-y-2">
                <p className="break-all font-mono text-foreground text-xs leading-relaxed">
                  {publicUrl}
                </p>
                <div className="flex flex-wrap gap-2">
                  <DocumentationCopyButton value={publicUrl} label="Copy URL" />
                  <Button
                    nativeButton={false}
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    render={
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <ArrowUpRightIcon size={4} />
                    Open URL
                  </Button>
                </div>
              </div>
            </CmsDetailMetaRow>
          </dl>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">Used in</h3>
            <MediaUsageList asset={asset} />
          </div>
        </CmsDialogBody>

        <CmsDialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </CmsDialogFooter>
      </CmsDialogContent>
  );
}
