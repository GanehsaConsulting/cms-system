"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BannerFormStatusFieldProps {
  value: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

export function BannerFormStatusField({
  value,
  disabled = false,
  onChange,
}: BannerFormStatusFieldProps) {
  return (
    <div className="flex flex-col items-end gap-2">
      <Label htmlFor="banner-is-active" className="text-muted-foreground">
        Active
      </Label>
      <div className="flex h-8 items-center gap-2">
        <Switch
          id="banner-is-active"
          checked={value}
          disabled={disabled}
          onCheckedChange={onChange}
          size="sm"
        />
        <span className="min-w-6 text-muted-foreground text-xs tabular-nums">
          {value ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
}
