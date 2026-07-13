import type { ClientFormValues } from "@/lib/validations/client";

/** Section labels for unsaved-change notices in the client form. */
export function getClientFormChangedSections(
  baseline: ClientFormValues,
  current: ClientFormValues,
): string[] {
  const sections: string[] = [];

  if (
    baseline.name !== current.name ||
    baseline.logo !== current.logo ||
    baseline.website !== current.website ||
    baseline.description !== current.description ||
    baseline.featured !== current.featured
  ) {
    sections.push("General");
  }

  if (
    JSON.stringify(baseline.testimonials) !==
    JSON.stringify(current.testimonials)
  ) {
    sections.push("Testimonials");
  }

  if (JSON.stringify(baseline.photos) !== JSON.stringify(current.photos)) {
    sections.push("Gallery");
  }

  return sections;
}
