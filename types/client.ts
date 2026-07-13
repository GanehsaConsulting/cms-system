export interface ClientTestimonial {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
}

export interface ClientPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  featured: boolean;
  testimonials: ClientTestimonial[];
  photos: ClientPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientInput {
  name: string;
  logo: string;
  website: string;
  description: string;
  featured: boolean;
  testimonials: ClientTestimonial[];
  photos: ClientPhoto[];
}
