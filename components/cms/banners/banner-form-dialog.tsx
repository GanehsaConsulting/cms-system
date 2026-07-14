"use client";

import { useEffect, useState, useTransition } from "react";
import { BannerFormImageField } from "@/components/cms/banners/banner-form-image-field";
import {
  BannerFormRedirectField,
  type BannerRedirectMode,
} from "@/components/cms/banners/banner-form-redirect-field";
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
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import {
  createBannerAction,
  updateBannerAction,
} from "@/lib/actions/banners";
import { getBannerImages } from "@/lib/banners/images";
import { bannerKeyFromImageFileName } from "@/lib/banners/key-from-image";
import {
  buildWhatsAppUrl,
  extractWhatsAppMessage,
  extractWhatsAppPhone,
  isValidWhatsAppPhone,
} from "@/lib/prices/whatsapp";
import type { Banner } from "@/types/banner";

interface BannerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
  /** Prefill unique key when creating from a website placement. */
  defaultKey?: string;
  /** Prevent editing the key when creating for a fixed placement. */
  lockKey?: boolean;
  onSaved: (banner: Banner) => void;
}

interface BannerFormState {
  name: string;
  key: string;
  images: string[];
  redirectMode: BannerRedirectMode;
  redirectUrl: string;
  whatsappPhone: string;
  whatsappMessage: string;
  isActive: boolean;
}

function isWhatsAppRedirectUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return (
      url.hostname === "wa.me" ||
      url.hostname === "api.whatsapp.com" ||
      url.hostname.endsWith(".whatsapp.com")
    );
  } catch {
    return value.trim().startsWith("whatsapp://");
  }
}

function createEmptyForm(defaultKey = ""): BannerFormState {
  return {
    name: "",
    key: defaultKey,
    images: [],
    redirectMode: "url",
    redirectUrl: "",
    whatsappPhone: "",
    whatsappMessage: "",
    isActive: true,
  };
}

function createFormFromBanner(banner: Banner): BannerFormState {
  const redirectUrl = banner.redirectUrl;
  const whatsappMode = isWhatsAppRedirectUrl(redirectUrl);
  const whatsappPhone = whatsappMode ? extractWhatsAppPhone(redirectUrl) : "";

  return {
    name: banner.name,
    key: banner.key,
    images: getBannerImages(banner),
    redirectMode: whatsappMode && whatsappPhone ? "whatsapp" : "url",
    redirectUrl: whatsappMode ? "" : redirectUrl,
    whatsappPhone,
    whatsappMessage: whatsappMode ? extractWhatsAppMessage(redirectUrl) : "",
    isActive: banner.isActive,
  };
}

function resolveRedirectUrl(form: BannerFormState) {
  if (form.redirectMode === "whatsapp") {
    return buildWhatsAppUrl(form.whatsappPhone, form.whatsappMessage);
  }

  return form.redirectUrl.trim();
}

export function BannerFormDialog({
  open,
  onOpenChange,
  banner,
  defaultKey = "",
  lockKey = false,
  onSaved,
}: BannerFormDialogProps) {
  const isEdit = Boolean(banner);
  const [form, setForm] = useState<BannerFormState>(() =>
    createEmptyForm(defaultKey),
  );
  const [keyTouched, setKeyTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const keyLocked = lockKey && !isEdit;

  useEffect(() => {
    if (!open) {
      return;
    }

    setError(null);
    setKeyTouched(isEdit || Boolean(defaultKey));
    setForm(
      banner ? createFormFromBanner(banner) : createEmptyForm(defaultKey),
    );
  }, [banner, defaultKey, isEdit, open]);

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
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleImagesChange(
    images: string[],
    meta?: { addedFileNames: string[] },
  ) {
    const firstFileName = meta?.addedFileNames[0];
    const shouldAutoKey =
      Boolean(firstFileName) &&
      !isEdit &&
      !keyTouched &&
      !keyLocked &&
      form.key.trim().length === 0;

    if (shouldAutoKey && firstFileName) {
      setKeyTouched(true);
      setForm((current) => ({
        ...current,
        images,
        key: bannerKeyFromImageFileName(firstFileName),
      }));
      return;
    }

    setForm((current) => ({ ...current, images }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (form.redirectMode === "whatsapp") {
      if (!isValidWhatsAppPhone(form.whatsappPhone)) {
        setError("Enter a valid WhatsApp number");
        return;
      }
    }

    const redirectUrl = resolveRedirectUrl(form);
    if (!redirectUrl) {
      setError(
        form.redirectMode === "whatsapp"
          ? "Enter a valid WhatsApp number"
          : "Redirect link is required",
      );
      return;
    }

    const key =
      form.key.trim().length >= 2
        ? form.key.trim()
        : bannerKeyFromImageFileName(`banner-${Date.now()}`);

    const formData = new FormData();
    formData.set("name", form.name);
    formData.set("key", key);
    formData.set("images", JSON.stringify(form.images));
    formData.set("redirectUrl", redirectUrl);
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
    form.images.length > 0 &&
    (form.redirectMode === "whatsapp"
      ? isValidWhatsAppPhone(form.whatsappPhone)
      : form.redirectUrl.trim().length > 0);

  return (
    <CmsDialog open={open} onOpenChange={handleOpenChange}>
      <CmsDialogContent showCloseButton={!isPending} size="md">
        <CmsDialogHeader>
          <CmsDialogTitle>
            {isEdit ? "Edit banner" : "Create banner"}
          </CmsDialogTitle>
          <CmsDialogDescription>
            {keyLocked
              ? `This banner will be shown in the “${defaultKey}” placement.`
              : "Add images and a redirect link. A unique key is created automatically from the first image."}
          </CmsDialogDescription>
        </CmsDialogHeader>

        <form onSubmit={handleSubmit} className={DIALOG_FORM_CLASS}>
          <CmsDialogBody className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1 space-y-2">
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

              <BannerFormStatusField
                value={form.isActive}
                disabled={isPending}
                onChange={(value) => updateField("isActive", value)}
              />
            </div>

            <BannerFormImageField
              value={form.images}
              disabled={isPending}
              onChange={handleImagesChange}
            />

            <BannerFormRedirectField
              mode={form.redirectMode}
              redirectUrl={form.redirectUrl}
              whatsappPhone={form.whatsappPhone}
              whatsappMessage={form.whatsappMessage}
              disabled={isPending}
              onModeChange={(mode) => updateField("redirectMode", mode)}
              onRedirectUrlChange={(value) =>
                updateField("redirectUrl", value)
              }
              onWhatsappPhoneChange={(value) =>
                updateField("whatsappPhone", value)
              }
              onWhatsappMessageChange={(value) =>
                updateField("whatsappMessage", value)
              }
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
