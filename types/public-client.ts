import type { Client } from "@/types/client";

/** List/card payload — no description, testimonials, or photos. */
export interface PublicClientSummary {
  id: string;
  brandId: string;
  name: string;
  logo: string;
  website: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Embedded on portfolio detail — no brand or featured flags. */
export interface PublicClientRef {
  id: string;
  name: string;
  logo: string;
  website: string;
}

export function toPublicClientSummary(client: Client): PublicClientSummary {
  const {
    description: _description,
    testimonials: _testimonials,
    photos: _photos,
    ...summary
  } = client;
  return summary;
}

export function toPublicClientRef(client: Client): PublicClientRef {
  return {
    id: client.id,
    name: client.name,
    logo: client.logo,
    website: client.website,
  };
}
