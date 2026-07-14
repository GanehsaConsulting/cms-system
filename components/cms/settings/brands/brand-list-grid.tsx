"use client";

import { BrandListCard } from "@/components/cms/settings/brands/brand-list-card";
import type { Brand } from "@/types/brand";

interface BrandListGridProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
}

export function BrandListGrid({ brands, onEdit }: BrandListGridProps) {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
      {brands.map((brand) => (
        <BrandListCard key={brand.id} brand={brand} onEdit={onEdit} />
      ))}
    </div>
  );
}
