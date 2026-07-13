"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BannerStatusBadge } from "@/components/cms/banners/banner-status-badge";

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
    <div className="space-y-2">
      <Label htmlFor="banner-is-active">Status</Label>
      <Select
        value={value ? "active" : "inactive"}
        disabled={disabled}
        onValueChange={(next) => onChange(next === "active")}
      >
        <SelectTrigger id="banner-is-active" className="w-full">
          <SelectValue>
            <BannerStatusBadge isActive={value} />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">
            <BannerStatusBadge isActive />
          </SelectItem>
          <SelectItem value="inactive">
            <BannerStatusBadge isActive={false} />
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
