"use client";

import { useMemo } from "react";
import { CmsFormPublishChecklist } from "@/components/shared/cms-form-publish-checklist";
import {
  getArticlePublishChecklist,
  type PublishChecklistValues,
} from "@/lib/articles/publish-checklist";

interface ArticleFormPublishChecklistProps {
  values: PublishChecklistValues;
}

export function ArticleFormPublishChecklist({
  values,
}: ArticleFormPublishChecklistProps) {
  const checklist = useMemo(
    () => getArticlePublishChecklist(values),
    [values],
  );

  return <CmsFormPublishChecklist checklist={checklist} />;
}
