"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BANNER_LIMITS } from "@/config/banner";

interface BannerFormKeyFieldProps {
  value: string;
  locked?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function BannerFormKeyField({
  value,
  locked = false,
  disabled = false,
  onChange,
}: BannerFormKeyFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="banner-key">Placement key</Label>
      <Input
        id="banner-key"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="promo-strip"
        maxLength={BANNER_LIMITS.key}
        disabled={disabled || locked}
        readOnly={locked}
        className={locked ? "bg-muted/40 font-mono text-sm" : "font-mono text-sm"}
        aria-describedby="banner-key-hint"
      />
      <p id="banner-key-hint" className="text-muted-foreground text-[11px] leading-relaxed">
        {locked
          ? "Fixed website placement — key cannot be changed."
          : "Unique key for frontend lookup (lowercase, hyphens). Leave blank to auto-generate from the first image."}
      </p>
    </div>
  );
}
