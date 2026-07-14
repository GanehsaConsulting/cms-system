import type { BrandFeatureId } from "@/config/brand";

export type BrandStatus = "active" | "inactive";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  status: BrandStatus;
  features: BrandFeatureId[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandInput {
  name: string;
  slug: string;
  logo: string;
  description: string;
  status: BrandStatus;
  features: BrandFeatureId[];
}
