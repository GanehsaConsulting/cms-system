"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { PortfolioFormCoverControl } from "@/components/cms/portfolio/portfolio-form-cover-control";
import type { PortfolioFormValues } from "@/lib/validations/portfolio";

interface PortfolioFormCoverFieldProps {
  control: Control<PortfolioFormValues>;
}

export function PortfolioFormCoverField({
  control,
}: PortfolioFormCoverFieldProps) {
  return (
    <Controller
      control={control}
      name="coverImage"
      render={({ field }) => (
        <PortfolioFormCoverControl
          value={field.value}
          onChange={field.onChange}
        />
      )}
    />
  );
}
