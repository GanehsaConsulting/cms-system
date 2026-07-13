"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  type CmsPasswordFormValues,
  cmsPasswordFormSchema,
} from "@/lib/validations/cms-user";

interface SidebarProfilePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: CmsPasswordFormValues) => void;
}

export function SidebarProfilePasswordDialog({
  open,
  onOpenChange,
  onSave,
}: SidebarProfilePasswordDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CmsPasswordFormValues>({
    resolver: zodResolver(cmsPasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [open, reset]);

  function onSubmit(values: CmsPasswordFormValues) {
    onSave(values);
    onOpenChange(false);
  }

  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent showCloseButton size="sm" className="flex flex-col">
        <CmsDialogHeader>
          <CmsDialogTitle>Change password</CmsDialogTitle>
          <CmsDialogDescription>
            Choose a new password for your CMS account.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CmsDialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.currentPassword)}
                {...register("currentPassword")}
              />
              {errors.currentPassword ? (
                <p className="text-destructive text-xs">
                  {errors.currentPassword.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.newPassword)}
                {...register("newPassword")}
              />
              {errors.newPassword ? (
                <p className="text-destructive text-xs">
                  {errors.newPassword.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword ? (
                <p className="text-destructive text-xs">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
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
            <Button type="submit" disabled={isSubmitting}>
              Update password
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
