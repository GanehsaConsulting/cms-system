"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SidebarProfilePhotoField } from "@/components/cms/sidebar-profile-photo-field";
import { Button } from "@/components/ui/button";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CmsUser } from "@/config/cms-user";
import {
  type CmsProfileFormValues,
  cmsProfileFormSchema,
} from "@/lib/validations/cms-user";

interface SidebarProfileEditDialogProps {
  user: CmsUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: CmsProfileFormValues) => void;
}

export function SidebarProfileEditDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: SidebarProfileEditDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CmsProfileFormValues>({
    resolver: zodResolver(cmsProfileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      });
    }
  }, [open, reset, user.avatarUrl, user.email, user.name]);

  function onSubmit(values: CmsProfileFormValues) {
    onSave(values);
    onOpenChange(false);
  }

  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent showCloseButton size="sm" className="flex flex-col">
        <CmsDialogHeader>
          <CmsDialogTitle>Edit profile</CmsDialogTitle>
          <CmsDialogDescription>
            Update your photo, display name, and email address.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CmsDialogBody className="space-y-4">
            <SidebarProfilePhotoField
              control={control}
              nameFallback={user.name}
            />

            <div className="space-y-2">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-destructive text-xs">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-role">Role</Label>
              <Input id="profile-role" value={user.role} readOnly disabled />
            </div>
          </CmsDialogBody>

          <CmsDialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              Save changes
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
