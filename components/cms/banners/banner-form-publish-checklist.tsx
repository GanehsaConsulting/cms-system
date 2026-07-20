"use client";

import { useMemo } from "react";
import { CmsFormPublishChecklist } from "@/components/shared/cms-form-publish-checklist";
import {
  getBannerPublishChecklist,
  type BannerPublishChecklistValues,
} from "@/lib/banners/publish-checklist";

interface BannerFormPublishChecklistProps {
  values: BannerPublishChecklistValues;
}

export function BannerFormPublishChecklist({
  values,
}: BannerFormPublishChecklistProps) {
  const checklist = useMemo(
    () => getBannerPublishChecklist(values),
    [values],
  );

  return <CmsFormPublishChecklist checklist={checklist} />;
}
