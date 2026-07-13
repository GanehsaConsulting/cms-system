import type { ClientFormValues } from "@/lib/validations/client";
import type { Client } from "@/types/client";

export function createEmptyClientInput(): ClientFormValues {
  return {
    name: "",
    logo: "",
    website: "",
    description: "",
    featured: false,
    testimonials: [],
    photos: [],
  };
}

export function createEmptyTestimonial(): ClientFormValues["testimonials"][number] {
  return {
    id: crypto.randomUUID(),
    quote: "",
    authorName: "",
    authorTitle: "",
  };
}

export function clientToFormInput(client: Client): ClientFormValues {
  return {
    name: client.name,
    logo: client.logo,
    website: client.website,
    description: client.description,
    featured: client.featured,
    testimonials: client.testimonials,
    photos: client.photos,
  };
}
