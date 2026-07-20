import {
  buildPublishChecklistResult,
  type PublishChecklistResult,
} from "@/lib/publish-checklist/shared";
import type { ClientFormValues } from "@/lib/validations/client";

export type ClientPublishChecklistValues = Pick<
  ClientFormValues,
  "name" | "logo" | "website" | "description" | "testimonials" | "photos"
>;

function hasCompleteTestimonials(
  testimonials: ClientFormValues["testimonials"],
): boolean {
  if (testimonials.length === 0) {
    return false;
  }

  return testimonials.every(
    (item) =>
      item.quote.trim().length > 0 && item.authorName.trim().length > 0,
  );
}

function hasCompletePhotos(photos: ClientFormValues["photos"]): boolean {
  if (photos.length === 0) {
    return false;
  }

  return photos.every((item) => item.url.trim().length > 0);
}

export function getClientPublishChecklist(
  values: ClientPublishChecklistValues,
): PublishChecklistResult {
  const items = [
    {
      id: "name",
      label: "Client name",
      hint: "Display name on the company profile",
      completed: values.name.trim().length > 0,
      required: true,
      weight: 25,
    },
    {
      id: "logo",
      label: "Logo",
      hint: "Upload a client logo",
      completed: values.logo.trim().length > 0,
      required: false,
      weight: 20,
    },
    {
      id: "description",
      label: "Description",
      hint: "Short overview of the client",
      completed: values.description.trim().length > 0,
      required: false,
      weight: 15,
    },
    {
      id: "website",
      label: "Website",
      hint: "Link to the client site",
      completed: values.website.trim().length > 0,
      required: false,
      weight: 10,
    },
    {
      id: "testimonials",
      label: "Testimonials",
      hint: "At least one complete quote",
      completed: hasCompleteTestimonials(values.testimonials),
      required: false,
      weight: 15,
    },
    {
      id: "photos",
      label: "Gallery photos",
      hint: "At least one gallery image",
      completed: hasCompletePhotos(values.photos),
      required: false,
      weight: 15,
    },
  ];

  return buildPublishChecklistResult(items);
}
