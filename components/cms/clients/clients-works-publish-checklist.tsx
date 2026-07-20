"use client";

import { useMemo } from "react";
import { CmsFormPublishChecklist } from "@/components/shared/cms-form-publish-checklist";
import { getClientPublishChecklist } from "@/lib/clients/publish-checklist";
import { getPortfolioPublishChecklist } from "@/lib/portfolio/publish-checklist";
import { buildPublishChecklistResult } from "@/lib/publish-checklist/shared";
import type { ClientFormValues } from "@/lib/validations/client";
import type { PortfolioFormValues } from "@/lib/validations/portfolio";

interface ClientsWorksPublishChecklistProps {
  clientValues: Pick<
    ClientFormValues,
    "name" | "logo" | "website" | "description" | "testimonials" | "photos"
  >;
  workValues: Pick<
    PortfolioFormValues,
    "title" | "clientId" | "workType" | "coverImage" | "description" | "url"
  >;
}

export function ClientsWorksPublishChecklist({
  clientValues,
  workValues,
}: ClientsWorksPublishChecklistProps) {
  const checklist = useMemo(() => {
    const clientChecklist = getClientPublishChecklist(clientValues);
    const workChecklist = getPortfolioPublishChecklist({
      ...workValues,
      clientId: workValues.clientId || "pending",
    });

    return buildPublishChecklistResult([
      ...clientChecklist.items,
      ...workChecklist.items,
    ]);
  }, [clientValues, workValues]);

  return <CmsFormPublishChecklist checklist={checklist} />;
}
