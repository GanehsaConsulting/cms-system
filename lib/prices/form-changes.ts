import type { PriceFormValues } from "@/lib/validations/price";
import type { LocalizedText } from "@/types/locale";

function localizedEqual(left: LocalizedText, right: LocalizedText) {
  return left.id === right.id && left.en === right.en && left.zh === right.zh;
}

function featuresEqual(
  left: PriceFormValues["features"],
  right: PriceFormValues["features"],
) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((feature, index) =>
    localizedEqual(feature.name, right[index]?.name ?? { id: "", en: "", zh: "" }),
  );
}

/** Section labels for unsaved-change notices in the price form. */
export function getPriceFormChangedSections(
  baseline: PriceFormValues,
  current: PriceFormValues,
): string[] {
  const sections: string[] = [];

  if (
    baseline.serviceSlug !== current.serviceSlug ||
    baseline.highlighted !== current.highlighted
  ) {
    sections.push("Plan details");
  }

  if (!localizedEqual(baseline.service, current.service)) {
    sections.push("Service name");
  }

  if (!localizedEqual(baseline.packageName, current.packageName)) {
    sections.push("Package name");
  }

  if (
    baseline.whatsappPhone !== current.whatsappPhone ||
    !localizedEqual(baseline.whatsappMessage, current.whatsappMessage)
  ) {
    sections.push("WhatsApp");
  }

  if (!localizedEqual(baseline.description, current.description)) {
    sections.push("Description");
  }

  if (!featuresEqual(baseline.features, current.features)) {
    sections.push("Features");
  }

  if (
    baseline.price !== current.price ||
    baseline.strikethroughPrice !== current.strikethroughPrice
  ) {
    sections.push("Pricing");
  }

  if (baseline.isActive !== current.isActive) {
    sections.push("Publication");
  }

  return sections;
}
