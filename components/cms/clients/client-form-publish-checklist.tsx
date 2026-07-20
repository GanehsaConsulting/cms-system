"use client";

import { useMemo } from "react";
import { CmsFormPublishChecklist } from "@/components/shared/cms-form-publish-checklist";
import {
  getClientPublishChecklist,
  type ClientPublishChecklistValues,
} from "@/lib/clients/publish-checklist";

interface ClientFormPublishChecklistProps {
  values: ClientPublishChecklistValues;
}

export function ClientFormPublishChecklist({
  values,
}: ClientFormPublishChecklistProps) {
  const checklist = useMemo(
    () => getClientPublishChecklist(values),
    [values],
  );

  return <CmsFormPublishChecklist checklist={checklist} />;
}
