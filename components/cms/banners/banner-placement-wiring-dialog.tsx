"use client";

import { useBrand } from "@/components/shared/brand-provider";
import { DocumentationCopyButton } from "@/components/cms/settings/documentation/documentation-copy-button";
import {
  CmsDialog,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import {
  buildBannerPlacementWiringMarkdown,
  type BannerPlacement,
} from "@/config/banner-placements";

interface BannerPlacementWiringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement: BannerPlacement | null;
}

export function BannerPlacementWiringDialog({
  open,
  onOpenChange,
  placement,
}: BannerPlacementWiringDialogProps) {
  const { activeBrand } = useBrand();
  const brandId = activeBrand?.id ?? "{brandId}";
  const markdown = placement
    ? buildBannerPlacementWiringMarkdown(placement, brandId)
    : "";

  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent size="lg" className="flex max-h-[min(85vh,40rem)] flex-col">
        <CmsDialogHeader>
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0 space-y-1">
              <CmsDialogTitle>
                {placement ? `${placement.title} wiring` : "Placement wiring"}
              </CmsDialogTitle>
              <CmsDialogDescription>
                Copy-ready docs for wiring this placement into the public
                frontend.
              </CmsDialogDescription>
            </div>
            {placement ? (
              <DocumentationCopyButton
                value={markdown}
                label="Copy docs"
                className="shrink-0"
              />
            ) : null}
          </div>
        </CmsDialogHeader>

        <div
          data-dialog-scroll
          className="min-h-0 flex-1 overflow-y-auto rounded-(--radius-inner) bg-black/3 p-4 dark:bg-white/4"
        >
          <pre className="wrap-break-word whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-foreground">
            {markdown}
          </pre>
        </div>
      </CmsDialogContent>
    </CmsDialog>
  );
}
