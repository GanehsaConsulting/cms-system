"use client";

import { useMemo } from "react";
import { CmsFormPublishChecklist } from "@/components/shared/cms-form-publish-checklist";
import {
  getPortfolioPublishChecklist,
  type PortfolioPublishChecklistValues,
} from "@/lib/portfolio/publish-checklist";

interface PortfolioFormPublishChecklistProps {
  values: PortfolioPublishChecklistValues;
}

export function PortfolioFormPublishChecklist({
  values,
}: PortfolioFormPublishChecklistProps) {
  const checklist = useMemo(
    () => getPortfolioPublishChecklist(values),
    [values],
  );

  return <CmsFormPublishChecklist checklist={checklist} />;
}
