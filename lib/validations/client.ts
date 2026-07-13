import { z } from "zod";
import { CLIENT_FORM_LIMITS } from "@/config/client-form";
import type { ClientInput } from "@/types/client";

const testimonialSchema = z.object({
  id: z.string().optional(),
  quote: z
    .string()
    .trim()
    .min(1, "Quote is required")
    .max(CLIENT_FORM_LIMITS.testimonialQuote),
  authorName: z
    .string()
    .trim()
    .min(1, "Author name is required")
    .max(CLIENT_FORM_LIMITS.testimonialAuthorName),
  authorTitle: z
    .string()
    .trim()
    .max(CLIENT_FORM_LIMITS.testimonialAuthorTitle),
});

const photoSchema = z.object({
  id: z.string().optional(),
  url: z.string().trim().min(1, "Photo is required"),
  caption: z.string().trim().max(CLIENT_FORM_LIMITS.photoCaption),
});

export const clientFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Client name is required")
    .max(CLIENT_FORM_LIMITS.name),
  logo: z.string(),
  website: z.string().trim().max(CLIENT_FORM_LIMITS.website),
  description: z.string().trim().max(CLIENT_FORM_LIMITS.description),
  featured: z.boolean(),
  testimonials: z
    .array(testimonialSchema)
    .max(CLIENT_FORM_LIMITS.maxTestimonials),
  photos: z.array(photoSchema).max(CLIENT_FORM_LIMITS.maxPhotos),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

export function clientFormToInput(values: ClientFormValues): ClientInput {
  return {
    name: values.name.trim(),
    logo: values.logo,
    website: values.website.trim(),
    description: values.description.trim(),
    featured: values.featured,
    testimonials: values.testimonials.map((item, index) => ({
      id: item.id || `testimonial-${index + 1}`,
      quote: item.quote.trim(),
      authorName: item.authorName.trim(),
      authorTitle: item.authorTitle.trim(),
    })),
    photos: values.photos.map((item, index) => ({
      id: item.id || `photo-${index + 1}`,
      url: item.url,
      caption: item.caption.trim(),
    })),
  };
}

function parseJsonArray(value: FormDataEntryValue | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(String(value)) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseClientForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    logo: String(formData.get("logo") ?? ""),
    website: String(formData.get("website") ?? ""),
    description: String(formData.get("description") ?? ""),
    featured: formData.get("featured") === "true",
    testimonials: parseJsonArray(formData.get("testimonials")),
    photos: parseJsonArray(formData.get("photos")),
  };
}
