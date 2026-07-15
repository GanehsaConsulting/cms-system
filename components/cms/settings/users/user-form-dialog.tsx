"use client";

import { useEffect, useState, useTransition } from "react";
import { UserFormBrandsField } from "@/components/cms/settings/users/user-form-brands-field";
import { UserFormPhotoField } from "@/components/cms/settings/users/user-form-photo-field";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  USER_FORM_LIMITS,
  USER_ROLES,
  USER_STATUSES,
  type UserRoleId,
} from "@/config/user";
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import { createUserAction, updateUserAction } from "@/lib/actions/users";
import { toSelectItems } from "@/lib/select-items";
import type { Brand } from "@/types/brand";
import type { User } from "@/types/user";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  brands: Brand[];
  onSaved: (user: User) => void;
}

function getDefaultBrandAccess(
  brands: Brand[],
  user?: User | null,
): string[] {
  if (user?.brandAccess.length) {
    return user.brandAccess;
  }

  const activeBrands = brands.filter((brand) => brand.status === "active");
  return activeBrands[0] ? [activeBrands[0].id] : [];
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  brands,
  onSaved,
}: UserFormDialogProps) {
  const isEdit = Boolean(user);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [position, setPosition] = useState(user?.position ?? "");
  const [role, setRole] = useState<UserRoleId>(user?.role ?? "admin");
  const [status, setStatus] = useState<User["status"]>(
    user?.status ?? "active",
  );
  const [brandAccess, setBrandAccess] = useState<string[]>(
    getDefaultBrandAccess(brands, user),
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      return;
    }

    setAvatarUrl(user?.avatarUrl ?? "");
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPosition(user?.position ?? "");
    setRole(user?.role ?? "admin");
    setStatus(user?.status ?? "active");
    setBrandAccess(getDefaultBrandAccess(brands, user));
    setError(null);
  }, [brands, open, user]);

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }

    onOpenChange(nextOpen);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("avatarUrl", avatarUrl);
    formData.set("name", name);
    formData.set("email", email);
    formData.set("position", position);
    formData.set("role", role);
    formData.set("status", status);
    formData.set("brandAccess", JSON.stringify(brandAccess));

    startTransition(async () => {
      const result = user
        ? await updateUserAction(user.id, formData)
        : await createUserAction(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      onSaved(result.user);
      onOpenChange(false);
    });
  }

  return (
    <CmsDialog open={open} onOpenChange={handleOpenChange}>
      <CmsDialogContent className="max-w-lg">
        <CmsDialogHeader>
          <CmsDialogTitle>{isEdit ? "Edit user" : "New user"}</CmsDialogTitle>
          <CmsDialogDescription>
            {isEdit
              ? "Update profile details, role, status, and brand access."
              : "Add a team member and assign their CMS role and brand access."}
          </CmsDialogDescription>
        </CmsDialogHeader>

        <form onSubmit={handleSubmit} className={DIALOG_FORM_CLASS}>
          <CmsDialogBody className="space-y-4">
            <UserFormPhotoField
              value={avatarUrl}
              nameFallback={name || "User"}
              disabled={isPending}
              onChange={setAvatarUrl}
            />

            <div className="space-y-2">
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                value={name}
                maxLength={USER_FORM_LIMITS.name}
                placeholder="e.g. Sarah Chen"
                disabled={isPending}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={email}
                maxLength={USER_FORM_LIMITS.email}
                placeholder="sarah@company.com"
                disabled={isPending}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-position">Position</Label>
              <Input
                id="user-position"
                value={position}
                maxLength={USER_FORM_LIMITS.position}
                placeholder="e.g. Content Manager"
                disabled={isPending}
                onChange={(event) => setPosition(event.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user-role">Role</Label>
                <Select
                  value={role}
                  items={toSelectItems(USER_ROLES)}
                  onValueChange={(value) => setRole(value as UserRoleId)}
                  disabled={isPending}
                >
                  <SelectTrigger id="user-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-status">Status</Label>
                <Select
                  value={status}
                  items={toSelectItems(USER_STATUSES)}
                  onValueChange={(value) =>
                    setStatus(value as User["status"])
                  }
                  disabled={isPending}
                >
                  <SelectTrigger id="user-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_STATUSES.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <UserFormBrandsField
              brands={brands}
              value={brandAccess}
              onChange={setBrandAccess}
              disabled={isPending}
            />

            {error ? (
              <p className="text-destructive text-sm" role="alert">
                {error}
              </p>
            ) : null}
          </CmsDialogBody>

          <CmsDialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || brands.length === 0}>
              {isPending ? "Saving..." : isEdit ? "Save changes" : "Create user"}
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
