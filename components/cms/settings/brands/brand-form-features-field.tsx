"use client";

import type { BrandFeatureId } from "@/config/brand";
import { BRAND_FEATURES } from "@/config/brand";
import { SETTINGS_GROUP, SETTINGS_ROW, SETTINGS_ROW_DIVIDER } from "@/config/settings-layout";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface BrandFormFeaturesFieldProps {
  value: BrandFeatureId[];
  onChange: (features: BrandFeatureId[]) => void;
  disabled?: boolean;
}

export function BrandFormFeaturesField({
  value,
  onChange,
  disabled = false,
}: BrandFormFeaturesFieldProps) {
  function toggleFeature(id: BrandFeatureId, checked: boolean) {
    if (checked) {
      onChange(Array.from(new Set([...value, id])));
      return;
    }

    if (value.length <= 1) {
      return;
    }

    onChange(value.filter((featureId) => featureId !== id));
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="font-medium text-sm">Enabled modules</p>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          Choose which menus and features this brand can access in the CMS.
        </p>
      </div>

      <div className={SETTINGS_GROUP}>
        {BRAND_FEATURES.map((feature, index) => {
          const checked = value.includes(feature.id);
          const isLast = index === BRAND_FEATURES.length - 1;

          return (
            <div
              key={feature.id}
              className={cn(
                SETTINGS_ROW,
                "items-start justify-between gap-4 py-3.5",
                !isLast && SETTINGS_ROW_DIVIDER,
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{feature.label}</p>
                <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
              <Switch
                checked={checked}
                disabled={disabled || (checked && value.length <= 1)}
                onCheckedChange={(nextChecked) =>
                  toggleFeature(feature.id, nextChecked)
                }
                aria-label={`Toggle ${feature.label}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
