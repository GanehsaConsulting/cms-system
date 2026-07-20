import { isLocalizedTextComplete } from "@/lib/locale";
import {
  buildPublishChecklistResult,
  type PublishChecklistResult,
} from "@/lib/publish-checklist/shared";
import {
  isValidWhatsAppPhone,
  normalizeWhatsAppPhone,
} from "@/lib/prices/whatsapp";
import type { PriceFormValues } from "@/lib/validations/price";

export type PricePublishChecklistValues = Pick<
  PriceFormValues,
  | "serviceSlug"
  | "description"
  | "service"
  | "packageName"
  | "price"
  | "whatsappPhone"
  | "whatsappMessage"
  | "features"
>;

function hasCompleteFeatures(
  features: PriceFormValues["features"],
): boolean {
  return (
    features.length > 0 &&
    features.every((feature) => isLocalizedTextComplete(feature.name))
  );
}

export function getPricePublishChecklist(
  values: PricePublishChecklistValues,
): PublishChecklistResult {
  const items = [
    {
      id: "category",
      label: "Price category",
      hint: "Select a service category",
      completed: values.serviceSlug.trim().length > 0,
      required: true,
      weight: 10,
    },
    {
      id: "service",
      label: "Service name",
      hint: "Fill in all languages (ID, EN, 中文)",
      completed: isLocalizedTextComplete(values.service),
      required: true,
      weight: 15,
    },
    {
      id: "packageName",
      label: "Package name",
      hint: "Fill in all languages (ID, EN, 中文)",
      completed: isLocalizedTextComplete(values.packageName),
      required: true,
      weight: 15,
    },
    {
      id: "price",
      label: "Price",
      hint: "Set a price in IDR",
      completed: values.price >= 1,
      required: true,
      weight: 15,
    },
    {
      id: "whatsappPhone",
      label: "WhatsApp number",
      hint: "Valid phone number for the CTA",
      completed: isValidWhatsAppPhone(
        normalizeWhatsAppPhone(values.whatsappPhone),
      ),
      required: true,
      weight: 10,
    },
    {
      id: "whatsappMessage",
      label: "WhatsApp message",
      hint: "Pre-filled message in all languages",
      completed: isLocalizedTextComplete(values.whatsappMessage),
      required: true,
      weight: 10,
    },
    {
      id: "features",
      label: "Features",
      hint: "At least one feature in all languages",
      completed: hasCompleteFeatures(values.features),
      required: true,
      weight: 15,
    },
    {
      id: "description",
      label: "Description",
      hint: "Optional plan description in all languages",
      completed: isLocalizedTextComplete(values.description),
      required: false,
      weight: 10,
    },
  ];

  return buildPublishChecklistResult(items);
}
