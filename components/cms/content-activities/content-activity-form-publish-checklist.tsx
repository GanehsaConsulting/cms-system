"use client";

import { useMemo } from "react";
import { CmsFormPublishChecklist } from "@/components/shared/cms-form-publish-checklist";
import {
  getContentActivityPublishChecklist,
  type ContentActivityPublishChecklistValues,
} from "@/lib/content-activities/publish-checklist";

interface ContentActivityFormPublishChecklistProps {
  values: ContentActivityPublishChecklistValues;
}

export function ContentActivityFormPublishChecklist({
  values,
}: ContentActivityFormPublishChecklistProps) {
  const checklist = useMemo(
    () => getContentActivityPublishChecklist(values),
    [values],
  );

  return <CmsFormPublishChecklist checklist={checklist} />;
}
