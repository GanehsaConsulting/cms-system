"use client";

import { PricePreviewCard } from "@/components/cms/prices/price-preview-card";
import {
  CmsDialog,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import type { PricePreviewData } from "@/types/price-preview";

interface PricePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PricePreviewData;
}

export function PricePreviewDialog({
  open,
  onOpenChange,
  data,
}: PricePreviewDialogProps) {
  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent showCloseButton size="md" className="flex flex-col">
        <CmsDialogHeader>
          <CmsDialogTitle>Pricing Card Preview</CmsDialogTitle>
          <CmsDialogDescription>
            How this plan will appear on the public pricing page. Get Started
            opens the generated WhatsApp link for the active language.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <div
          data-dialog-scroll
          className="relative flex min-h-0 flex-1 justify-center overflow-y-auto overflow-anchor-none bg-[#f5f5f7]/80 p-6 dark:bg-black/40"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(255_255_255/0.55),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgb(44_44_46/0.45),transparent_70%)]"
          />
          <div className="relative w-full max-w-sm">
            <PricePreviewCard data={data} />
          </div>
        </div>
      </CmsDialogContent>
    </CmsDialog>
  );
}
