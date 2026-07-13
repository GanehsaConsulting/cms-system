import type { LocalizedText } from "@/types/locale";

export interface PriceFeature {
  id: string;
  name: LocalizedText;
}

export interface Price {
  id: string;
  slug: string;
  serviceSlug: string;
  category: string;
  highlighted: boolean;
  description: LocalizedText;
  service: LocalizedText;
  packageName: LocalizedText;
  price: number;
  strikethroughPrice: number;
  whatsappPhone: string;
  whatsappMessage: LocalizedText;
  isActive: boolean;
  features: PriceFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceInput {
  slug: string;
  serviceSlug: string;
  category: string;
  highlighted: boolean;
  description: LocalizedText;
  service: LocalizedText;
  packageName: LocalizedText;
  price: number;
  strikethroughPrice: number;
  whatsappPhone: string;
  whatsappMessage: LocalizedText;
  isActive: boolean;
  features: PriceFeature[];
}
