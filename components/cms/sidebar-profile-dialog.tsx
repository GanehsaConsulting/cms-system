"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SidebarProfileAction } from "@/components/cms/sidebar-profile-action";
import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { SidebarProfileEditDialog } from "@/components/cms/sidebar-profile-edit-dialog";
import { SidebarProfilePasswordDialog } from "@/components/cms/sidebar-profile-password-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import type { CmsUser } from "@/config/cms-user";
import { RADIUS_INNER } from "@/config/shape";
import { authClient } from "@/lib/auth/client";
import { KeyIcon, LogoutIcon, PencilSimpleIcon } from "@/lib/icons";
import { notifyError, notifySuccess } from "@/lib/notify/action-toast";
import type {
  CmsPasswordFormValues,
  CmsProfileFormValues,
} from "@/lib/validations/cms-user";
import { cn } from "@/lib/utils";

interface SidebarProfileDialogProps {
  user: CmsUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdate: (values: CmsProfileFormValues) => void;
}

export function SidebarProfileDialog({
  user,
  open,
  onOpenChange,
  onUserUpdate,
}: SidebarProfileDialogProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [notice, setNotice] = useState<{
    title: string;
    description: string;
  } | null>(null);

  function openEdit() {
    onOpenChange(false);
    setEditOpen(true);
  }

  function openPassword() {
    onOpenChange(false);
    setPasswordOpen(true);
  }

  function handleProfileSave(values: CmsProfileFormValues) {
    startSaving(async () => {
      setNotice(null);

      // Better Auth separates "update profile" vs "change email".
      // - updateUser: name + image
      // - changeEmail: newEmail
      const updateResult = await authClient.updateUser({
        name: values.name,
        image: values.avatarUrl || null,
      });

      if (updateResult.error) {
        const description =
          updateResult.error.message || "Please try again later.";
        notifyError(description);
        setNotice({
          title: "Could not update profile",
          description,
        });
        return;
      }

      const emailResult = await authClient.changeEmail({
        newEmail: values.email,
      });

      if (emailResult.error) {
        const description =
          emailResult.error.message || "Please try again later.";
        notifyError(description);
        setNotice({
          title: "Could not update email",
          description,
        });
        return;
      }

      onUserUpdate(values);
      notifySuccess("Profile updated.");
      setNotice({
        title: "Profile updated",
        description: "Your profile details have been saved.",
      });
      router.refresh();
    });
  }

  function handlePasswordSave(values: CmsPasswordFormValues) {
    startSaving(async () => {
      setNotice(null);
      const result = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (result.error) {
        const description =
          result.error.message || "Please check your current password.";
        notifyError(description);
        setNotice({
          title: "Could not update password",
          description,
        });
        return;
      }

      notifySuccess("Password updated.");
      setNotice({
        title: "Password updated",
        description: "Your sign-in password has been updated.",
      });
      router.refresh();
    });
  }

  function handleLogoutConfirm() {
    startLogout(async () => {
      const result = await authClient.signOut();

      if (result.error) {
        setLogoutOpen(false);
        const description =
          result.error.message || "Something went wrong. Please try again.";
        notifyError(description);
        setNotice({
          title: "Could not sign out",
          description,
        });
        return;
      }

      notifySuccess("Signed out.");
      setLogoutOpen(false);
      onOpenChange(false);
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <>
      <CmsDialog open={open} onOpenChange={onOpenChange}>
        <CmsDialogContent showCloseButton size="sm" className="flex flex-col">
          <CmsDialogHeader className="space-y-4 py-5">
            <div className="flex items-center gap-3">
              <SidebarProfileAvatar
                name={user.name}
                avatarUrl={user.avatarUrl}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <CmsDialogTitle className="truncate text-base">
                  {user.name}
                </CmsDialogTitle>
                <CmsDialogDescription className="mt-1 truncate">
                  {user.email}
                </CmsDialogDescription>
              </div>
            </div>

            <dl
              className={cn(
                RADIUS_INNER,
                "grid grid-cols-2 gap-3 bg-muted/50 px-3 py-3 text-xs",
              )}
            >
              <div className="space-y-1">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="font-medium text-foreground">{user.role}</dd>
              </div>
              <div className="min-w-0 space-y-1">
                <dt className="text-muted-foreground">Organization</dt>
                <dd className="truncate font-medium text-foreground">
                  {user.organization}
                </dd>
              </div>
            </dl>
          </CmsDialogHeader>

          <CmsDialogBody className="space-y-1 p-2">
            <SidebarProfileAction
              icon={PencilSimpleIcon}
              label="Edit profile"
              description="Update your name and contact details"
              onClick={openEdit}
            />
            <SidebarProfileAction
              icon={KeyIcon}
              label="Change password"
              description="Update your sign-in password"
              onClick={openPassword}
            />

            <div className="my-1 border-(--separator) border-t" />

            <SidebarProfileAction
              icon={LogoutIcon}
              label="Log out"
              description="Sign out of this CMS session"
              destructive
              onClick={() => setLogoutOpen(true)}
            />
          </CmsDialogBody>
        </CmsDialogContent>
      </CmsDialog>

      <SidebarProfileEditDialog
        user={user}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleProfileSave}
      />

      <SidebarProfilePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        onSave={handlePasswordSave}
      />

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="Log out?"
        description="You will need to sign in again to manage content in this CMS."
        confirmLabel="Log out"
        variant="destructive"
        isPending={isLoggingOut}
        onConfirm={handleLogoutConfirm}
      />

      <ConfirmDialog
        open={Boolean(notice)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setNotice(null);
          }
        }}
        title={notice?.title ?? ""}
        description={notice?.description ?? ""}
        confirmLabel="OK"
        onConfirm={() => setNotice(null)}
      />
    </>
  );
}
