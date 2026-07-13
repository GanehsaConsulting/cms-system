"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriceStatusBadge } from "@/components/cms/prices/price-status-badge";
import type { PriceFormValues } from "@/lib/validations/price";

interface PriceFormStatusFieldProps {
  control: Control<PriceFormValues>;
}

export function PriceFormStatusField({ control }: PriceFormStatusFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="isActive">Status</Label>
      <Controller
        control={control}
        name="isActive"
        render={({ field }) => (
          <Select
            value={field.value ? "active" : "inactive"}
            onValueChange={(value) => field.onChange(value === "active")}
          >
            <SelectTrigger id="isActive" className="w-full">
              <PriceStatusBadge isActive={field.value} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <PriceStatusBadge isActive />
              </SelectItem>
              <SelectItem value="inactive">
                <PriceStatusBadge isActive={false} />
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
