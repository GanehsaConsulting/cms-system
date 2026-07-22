import {
  buildPublishChecklistResult,
  type PublishChecklistResult,
} from "@/lib/publish-checklist/shared";

export interface ContentActivityPublishChecklistValues {
  title: string;
  content: string;
  displayAt: string;
  images: string[];
  showTitle: boolean;
  linkUrl: string;
}

export function getContentActivityPublishChecklist(
  values: ContentActivityPublishChecklistValues,
): PublishChecklistResult {
  const items = [
    {
      id: "title",
      label: "Title",
      hint: "Shown in the CMS and optionally on the public card",
      completed: values.title.trim().length > 0,
      required: true,
      weight: 20,
    },
    {
      id: "content",
      label: "Description",
      hint: "Main body content for the activity or promo",
      completed: values.content.replace(/<[^>]*>/g, "").trim().length > 0,
      required: true,
      weight: 25,
    },
    {
      id: "displayAt",
      label: "Display date",
      hint: "When the card should appear on the public site",
      completed: values.displayAt.trim().length > 0,
      required: true,
      weight: 20,
    },
    {
      id: "images",
      label: "Images",
      hint: "At least one image for the card carousel",
      completed: values.images.length > 0,
      required: true,
      weight: 20,
    },
    {
      id: "linkUrl",
      label: values.showTitle ? "Link URL" : "Link URL (optional)",
      hint: values.showTitle
        ? "Required when the title is shown on the public site"
        : "Instagram or promo destination link",
      completed: values.showTitle ? values.linkUrl.trim().length > 0 : true,
      required: values.showTitle,
      weight: 15,
    },
  ];

  return buildPublishChecklistResult(items);
}
