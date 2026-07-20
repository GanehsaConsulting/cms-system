import type { Client } from "@/types/client";

export function normalizeClient(client: Partial<Client> & { id: string }): Client {
  return {
    id: client.id,
    brandId: String(client.brandId ?? "").trim(),
    name: client.name ?? "",
    logo: client.logo ?? "",
    website: client.website ?? "",
    description: client.description ?? "",
    featured: client.featured ?? false,
    testimonials: Array.isArray(client.testimonials)
      ? client.testimonials.map((item, index) => ({
          id: item.id || `testimonial-${index + 1}`,
          quote: item.quote ?? "",
          authorName: item.authorName ?? "",
          authorTitle: item.authorTitle ?? "",
        }))
      : [],
    photos: Array.isArray(client.photos)
      ? client.photos.map((item, index) => ({
          id: item.id || `photo-${index + 1}`,
          url: item.url ?? "",
          caption: item.caption ?? "",
        }))
      : [],
    createdAt: client.createdAt ?? new Date().toISOString(),
    updatedAt: client.updatedAt ?? new Date().toISOString(),
  };
}
