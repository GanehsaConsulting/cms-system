"use client";

import type { Control } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { SidebarProfilePhotoControl } from "@/components/cms/sidebar-profile-photo-control";
import type { CmsProfileFormValues } from "@/lib/validations/cms-user";

interface SidebarProfilePhotoFieldProps {
  control: Control<CmsProfileFormValues>;
  nameFallback: string;
}

export function SidebarProfilePhotoField({
  control,
  nameFallback,
}: SidebarProfilePhotoFieldProps) {
  const watchedName = useWatch({ control, name: "name" });
  const displayName = watchedName.trim() || nameFallback;

  return (
    <Controller
      control={control}
      name="avatarUrl"
      render={({ field }) => (
        <SidebarProfilePhotoControl
          value={field.value}
          displayName={displayName}
          onChange={field.onChange}
        />
      )}
    />
  );
}
