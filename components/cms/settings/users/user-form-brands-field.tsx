"use client";

import {
  SETTINGS_GROUP,
  SETTINGS_ROW,
  SETTINGS_ROW_DIVIDER,
} from "@/config/settings-layout";
import { Switch } from "@/components/ui/switch";
import type { Brand } from "@/types/brand";
import { cn } from "@/lib/utils";

interface UserFormBrandsFieldProps {
  brands: Brand[];
  value: string[];
  onChange: (brandIds: string[]) => void;
  disabled?: boolean;
}

export function UserFormBrandsField({
  brands,
  value,
  onChange,
  disabled = false,
}: UserFormBrandsFieldProps) {
  function toggleBrand(id: string, checked: boolean) {
    if (checked) {
      onChange(Array.from(new Set([...value, id])));
      return;
    }

    if (value.length <= 1) {
      return;
    }

    onChange(value.filter((brandId) => brandId !== id));
  }

  if (brands.length === 0) {
    return (
      <div className="space-y-2">
        <p className="font-medium text-sm">Brand access</p>
        <p className="text-muted-foreground text-xs leading-relaxed">
          No brands available. Create a brand first before assigning access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="font-medium text-sm">Brand access</p>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          Choose which brand workspaces this user can access.
        </p>
      </div>

      <div className={SETTINGS_GROUP}>
        {brands.map((brand, index) => {
          const checked = value.includes(brand.id);
          const isLast = index === brands.length - 1;
          const isBrandInactive = brand.status !== "active";

          return (
            <div
              key={brand.id}
              className={cn(
                SETTINGS_ROW,
                "items-start justify-between gap-4 py-3.5",
                !isLast && SETTINGS_ROW_DIVIDER,
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{brand.name}</p>
                <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">
                  {isBrandInactive
                    ? "Inactive brand — access can be assigned but the brand is disabled."
                    : brand.description || brand.slug}
                </p>
              </div>
              <Switch
                checked={checked}
                disabled={disabled || (checked && value.length <= 1)}
                onCheckedChange={(nextChecked) =>
                  toggleBrand(brand.id, nextChecked)
                }
                aria-label={`Toggle access for ${brand.name}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
