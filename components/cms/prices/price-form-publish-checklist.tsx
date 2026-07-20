"use client";

import { useMemo } from "react";
import { CmsFormPublishChecklist } from "@/components/shared/cms-form-publish-checklist";
import {
  getPricePublishChecklist,
  type PricePublishChecklistValues,
} from "@/lib/prices/publish-checklist";

interface PriceFormPublishChecklistProps {
  values: PricePublishChecklistValues;
}

export function PriceFormPublishChecklist({
  values,
}: PriceFormPublishChecklistProps) {
  const checklist = useMemo(
    () => getPricePublishChecklist(values),
    [values],
  );

  return <CmsFormPublishChecklist checklist={checklist} />;
}
