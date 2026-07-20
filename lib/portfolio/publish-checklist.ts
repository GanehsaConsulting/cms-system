import {
  buildPublishChecklistResult,
  type PublishChecklistResult,
} from "@/lib/publish-checklist/shared";
import type { PortfolioFormValues } from "@/lib/validations/portfolio";

export type PortfolioPublishChecklistValues = Pick<
  PortfolioFormValues,
  "title" | "clientId" | "workType" | "coverImage" | "description" | "url"
>;

export function getPortfolioPublishChecklist(
  values: PortfolioPublishChecklistValues,
): PublishChecklistResult {
  const items = [
    {
      id: "title",
      label: "Work title",
      hint: "Name shown on the portfolio card",
      completed: values.title.trim().length > 0,
      required: true,
      weight: 25,
    },
    {
      id: "clientId",
      label: "Client",
      hint: "Link this work to a client",
      completed:
        values.clientId.trim().length > 0 && values.clientId !== "pending",
      required: true,
      weight: 20,
    },
    {
      id: "workType",
      label: "Work type",
      hint: "Social media or website project",
      completed: values.workType === "social-media" || values.workType === "website",
      required: true,
      weight: 5,
    },
    {
      id: "coverImage",
      label: "Cover image",
      hint: "Thumbnail for the portfolio card",
      completed: values.coverImage.trim().length > 0,
      required: false,
      weight: 20,
    },
    {
      id: "description",
      label: "Description",
      hint: "Brief summary of the work",
      completed: values.description.trim().length > 0,
      required: false,
      weight: 15,
    },
    {
      id: "url",
      label: "Project URL",
      hint: "Link to the live project or case study",
      completed: values.url.trim().length > 0,
      required: false,
      weight: 15,
    },
  ];

  return buildPublishChecklistResult(items);
}
