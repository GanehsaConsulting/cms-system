"use client";

import { useEffect, useState, useTransition } from "react";
import { BannerFormImageField } from "@/components/cms/banners/banner-form-image-field";
import { BannerFormStatusField } from "@/components/cms/banners/banner-form-status-field";
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
import { BANNER_LIMITS } from "@/config/banner";
import {
  createBannerAction,
  updateBannerAction,
} from "@/lib/actions/banners";
import { slugify } from "@/lib/articles/slug";
import type { Banner } from "@/types/banner";

interface BannerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
  onSaved: (banner: Banner) => void;
}

interface BannerFormState {
  name: string;
  key: string;
  image: string;
  redirectUrl: string;
  isActive: boolean;
}

function createEmptyForm(): BannerFormState {
  return {
    name: "",
    key: "",
    image: "",
    redirectUrl: "",
    isActive: true,
  };
}

function createFormFromBanner(banner: Banner): BannerFormState {
  return {
    name: banner.name,
    key: banner.key,
    image: banner.image,
    redirectUrl: banner.redirectUrl,
    isActive: banner.isActive,
  };
}

export function BannerFormDialog({
  open,
  onOpenChange,
  banner,
  onSaved,
}: BannerFormDialogProps) {
  const isEdit = Boolean(banner);
  const [form, setForm] = useState<BannerFormState>(createEmptyForm);
  const [keyTouched, setKeyTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      return;
    }

    setError(null);
    setKeyTouched(isEdit);
    setForm(banner ? createFormFromBanner(banner) : createEmptyForm());
  }, [banner, isEdit, open]);

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }

    onOpenChange(nextOpen);
  }

  function updateField<K extends keyof BannerFormState>(
    field: K,
    value: BannerFormState[K],
  ) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "name" && !isEdit && !keyTouched) {
        next.key = slugify(String(value));
      }

      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("key", form.key);
    formData.set("image", form.image);
    formData.set("redirectUrl", form.redirectUrl);
    formData.set("isActive", form.isActive ? "true" : "false");

    startTransition(async () => {
      const result = banner
        ? await updateBannerAction(banner.id, formData)
        : await createBannerAction(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      onSaved(result.banner);
      onOpenChange(false);
    });
  }

  const canSubmit =
    form.name.trim().length >= 2 &&
    form.key.trim().length >= 2 &&
    form.image.trim().length > 0 &&
    form.redirectUrl.trim().length > 0;

  return (
    <CmsDialog open={open} onOpenChange={handleOpenChange}>
      <CmsDialogContent showCloseButton={!isPending} size="md">
        <CmsDialogHeader>
          <CmsDialogTitle>
            {isEdit ? "Edit banner" : "Create banner"}
          </CmsDialogTitle>
          <CmsDialogDescription>
            Place banners on the public site by unique key — not by page path.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <form onSubmit={handleSubmit}>
          <CmsDialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner-name">Name</Label>
              <Input
                id="banner-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Homepage hero"
                maxLength={BANNER_LIMITS.name}
                disabled={isPending}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-key">Unique key</Label>
              <Input
                id="banner-key"
                value={form.key}
                onChange={(event) => {
                  setKeyTouched(true);
                  updateField("key", slugify(event.target.value));
                }}
                placeholder="homepage"
                maxLength={BANNER_LIMITS.key}
                disabled={isPending}
                className="font-mono text-sm"
              />
              <p className="text-muted-foreground text-xs">
                Used by the frontend to fetch this banner (e.g.{" "}
                <span className="font-mono">popup</span>,{" "}
                <span className="font-mono">mega-menu</span>).
              </p>
            </div>

            <BannerFormImageField
              value={form.image}
              disabled={isPending}
              onChange={(value) => updateField("image", value)}
            />

            <div className="space-y-2">
              <Label htmlFor="banner-redirect-url">Redirect link</Label>
              <Input
                id="banner-redirect-url"
                value={form.redirectUrl}
                onChange={(event) =>
                  updateField("redirectUrl", event.target.value)
                }
                placeholder="https://wa.me/6281234567890 or /contact"
                maxLength={BANNER_LIMITS.redirectUrl}
                disabled={isPending}
              />
            </div>

            <BannerFormStatusField
              value={form.isActive}
              disabled={isPending}
              onChange={(value) => updateField("isActive", value)}
            />

            {error ? (
              <p className="text-destructive text-xs">{error}</p>
            ) : null}
          </CmsDialogBody>

          <CmsDialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !canSubmit}>
              {isPending
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create banner"}
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
