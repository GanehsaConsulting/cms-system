"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LIST_FILTER_FIELD_CLASS } from "@/config/list-toolbar";
import { RADIUS_DEEP } from "@/config/shape";
import { getPriceCategoryLabel } from "@/lib/prices/categories";
import type { PriceCategory } from "@/types/price-category";
import { cn } from "@/lib/utils";

interface PricesListServiceFilterFieldProps {
  value: string;
  services: string[];
  categories: PriceCategory[];
  onChange: (value: string) => void;
}

export function PricesListServiceFilterField({
  value,
  services,
  categories,
  onChange,
}: PricesListServiceFilterFieldProps) {
  const [query, setQuery] = useState("");

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return services;
    }

    return services.filter((serviceSlug) => {
      const label = getPriceCategoryLabel(serviceSlug, categories).toLowerCase();
      return (
        serviceSlug.toLowerCase().includes(normalizedQuery) ||
        label.includes(normalizedQuery)
      );
    });
  }, [categories, query, services]);

  function handleSelect(serviceSlug: string) {
    onChange(serviceSlug);
    setQuery("");
  }

  return (
    <div className={LIST_FILTER_FIELD_CLASS}>
      <Label htmlFor="price-service-filter-search">Price category</Label>
      <div className={cn(RADIUS_DEEP, "overflow-hidden border border-input")}>
        <div className="relative border-input border-b px-2 py-1.5">
          <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="price-service-filter-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search categories..."
            className="h-8 border-0 bg-transparent pl-7 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="max-h-36 space-y-0.5 overflow-y-auto p-1">
          <button
            type="button"
            onClick={() => handleSelect("all")}
            className={cn(
              RADIUS_DEEP,
              "flex w-full items-center px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
              value === "all" && "bg-muted font-medium",
            )}
          >
            All categories
          </button>

          {filteredServices.length > 0 ? (
            filteredServices.map((serviceSlug) => (
              <button
                key={serviceSlug}
                type="button"
                onClick={() => handleSelect(serviceSlug)}
                className={cn(
                  RADIUS_DEEP,
                  "flex w-full flex-col items-start px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                  value === serviceSlug && "bg-muted font-medium",
                )}
              >
                <span>{getPriceCategoryLabel(serviceSlug, categories)}</span>
                <span className="text-muted-foreground text-xs">
                  {serviceSlug}
                </span>
              </button>
            ))
          ) : (
            <p className="px-2.5 py-2 text-muted-foreground text-sm">
              No categories found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
