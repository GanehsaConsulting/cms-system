"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { ClientFormLogoControl } from "@/components/cms/clients/client-form-logo-control";
import type { ClientFormValues } from "@/lib/validations/client";

interface ClientFormLogoFieldProps {
  control: Control<ClientFormValues>;
}

export function ClientFormLogoField({ control }: ClientFormLogoFieldProps) {
  return (
    <Controller
      control={control}
      name="logo"
      render={({ field }) => (
        <ClientFormLogoControl value={field.value} onChange={field.onChange} />
      )}
    />
  );
}
