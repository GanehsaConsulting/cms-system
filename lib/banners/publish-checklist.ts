import {
  isValidWhatsAppPhone,
} from "@/lib/prices/whatsapp";
import {
  buildPublishChecklistResult,
  type PublishChecklistResult,
} from "@/lib/publish-checklist/shared";

export type BannerPublishChecklistValues = {
  name: string;
  key: string;
  images: string[];
  redirectMode: "url" | "whatsapp";
  redirectUrl: string;
  whatsappPhone: string;
  isActive: boolean;
};

function hasValidRedirect(values: BannerPublishChecklistValues): boolean {
  if (values.redirectMode === "whatsapp") {
    return isValidWhatsAppPhone(values.whatsappPhone);
  }

  return values.redirectUrl.trim().length > 0;
}

export function getBannerPublishChecklist(
  values: BannerPublishChecklistValues,
): PublishChecklistResult {
  const items = [
    {
      id: "name",
      label: "Banner name",
      hint: "Internal label shown in the CMS",
      completed: values.name.trim().length >= 2,
      required: true,
      weight: 15,
    },
    {
      id: "key",
      label: "Placement key",
      hint: "Unique key for public lookup (e.g. homepage, popup)",
      completed: values.key.trim().length >= 2,
      required: true,
      weight: 20,
    },
    {
      id: "images",
      label: "Banner images",
      hint: "Add at least one image; multiple images become a carousel",
      completed: values.images.length > 0,
      required: true,
      weight: 35,
    },
    {
      id: "redirect",
      label: "Redirect link",
      hint: "URL, site path, or WhatsApp destination when clicked",
      completed: hasValidRedirect(values),
      required: true,
      weight: 20,
    },
    {
      id: "active",
      label: "Active on public site",
      hint: "Turn on Active to expose this banner via the public API",
      completed: values.isActive,
      required: false,
      weight: 10,
    },
  ];

  return buildPublishChecklistResult(items);
}
