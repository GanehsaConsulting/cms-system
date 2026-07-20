"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { PasswordInput } from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import { setUserPasswordAction } from "@/lib/actions/users";
import { notifyFromActionResult } from "@/lib/notify/action-toast";
import {
  type AdminSetPasswordValues,
  adminSetPasswordSchema,
} from "@/lib/validations/user";
import type { User } from "@/types/user";

interface UserSetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserSetPasswordDialog({
  open,
  onOpenChange,
  user,
}: UserSetPasswordDialogProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminSetPasswordValues>({
    resolver: zodResolver(adminSetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [open, reset]);

  function onSubmit(values: AdminSetPasswordValues) {
    if (!user) {
      return;
    }

    const formData = new FormData();
    formData.set("newPassword", values.newPassword);
    formData.set("confirmPassword", values.confirmPassword);

    startTransition(async () => {
      const result = await setUserPasswordAction(user.id, formData);
      if (
        !notifyFromActionResult(result, "Password updated.", "Failed to update password.")
      ) {
        return;
      }
      onOpenChange(false);
    });
  }

  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent showCloseButton size="sm" className="flex flex-col">
        <CmsDialogHeader>
          <CmsDialogTitle>Set password</CmsDialogTitle>
          <CmsDialogDescription>
            {user
              ? `Override the login password for ${user.name}. They can sign in with this password immediately.`
              : "Override the login password for this user."}
          </CmsDialogDescription>
        </CmsDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className={DIALOG_FORM_CLASS}>
          <CmsDialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-new-password">New password</Label>
              <PasswordInput
                id="admin-new-password"
                autoComplete="new-password"
                disabled={isPending}
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
              <Label htmlFor="admin-confirm-password">Confirm password</Label>
              <PasswordInput
                id="admin-confirm-password"
                autoComplete="new-password"
                disabled={isPending}
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
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !user}>
              {isPending ? "Saving..." : "Set password"}
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
