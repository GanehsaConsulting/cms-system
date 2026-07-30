import type { LocalizedText } from "@/types/locale";

export interface PriceFeature {
  id: string;
  name: LocalizedText;
}

export interface Price {
  id: string;
  brandId: string;
  slug: string;
  serviceSlug: string;
  category: string;
  highlighted: boolean;
  description: LocalizedText;
  service: LocalizedText;
  packageName: LocalizedText;
  price: number;
  strikethroughPrice: number;
  /** When true, FE should show “Starting from” and hide gimmick/strikethrough. */
  showStartingFrom: boolean;
  whatsappPhone: string;
  whatsappMessage: LocalizedText;
  isActive: boolean;
  features: PriceFeature[];
  createdAt: string;
  updatedAt: string;
  /** Set when the price plan is in Trash (soft-deleted). */
  deletedAt?: string | null;
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
  showStartingFrom: boolean;
  whatsappPhone: string;
  whatsappMessage: LocalizedText;
  isActive: boolean;
  features: PriceFeature[];
}
