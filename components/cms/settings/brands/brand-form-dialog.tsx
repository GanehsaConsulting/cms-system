"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { BrandFormFeaturesField } from "@/components/cms/settings/brands/brand-form-features-field";
import { CmsAlert } from "@/components/shared/cms-alert";
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
import { Textarea } from "@/components/ui/textarea";
import { BRAND_FEATURE_IDS, BRAND_FORM_LIMITS, BRAND_STATUSES } from "@/config/brand";
import { DIALOG_FORM_CLASS } from "@/config/dialog";
import { createBrandAction, updateBrandAction } from "@/lib/actions/brands";
import { slugify } from "@/lib/articles/slug";
import { notifyError, notifySuccess } from "@/lib/notify/action-toast";
import { toSelectItems } from "@/lib/select-items";
import type { BrandFeatureId } from "@/config/brand";
import type { Brand } from "@/types/brand";

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand?: Brand | null;
  onSaved: (brand: Brand) => void;
}

export function BrandFormDialog({
  open,
  onOpenChange,
  brand,
  onSaved,
}: BrandFormDialogProps) {
  const isEdit = Boolean(brand);
  const [name, setName] = useState(brand?.name ?? "");
  const [slug, setSlug] = useState(brand?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(brand));
  const [description, setDescription] = useState(brand?.description ?? "");
  const [status, setStatus] = useState<Brand["status"]>(
    brand?.status ?? "active",
  );
  const [features, setFeatures] = useState<BrandFeatureId[]>(
    brand?.features ?? [...BRAND_FEATURE_IDS],
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(brand?.name ?? "");
    setSlug(brand?.slug ?? "");
    setSlugTouched(Boolean(brand));
    setDescription(brand?.description ?? "");
    setStatus(brand?.status ?? "active");
    setFeatures(brand?.features ?? [...BRAND_FEATURE_IDS]);
    setError(null);
  }, [brand, open]);

  useEffect(() => {
    if (slugTouched || isEdit) {
      return;
    }

    setSlug(slugify(name));
  }, [isEdit, name, slugTouched]);

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
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("logo", brand?.logo ?? "");
    formData.set("description", description);
    formData.set("status", status);
    formData.set("features", JSON.stringify(features));

    startTransition(async () => {
      const result = brand
        ? await updateBrandAction(brand.id, formData)
        : await createBrandAction(formData);

      if (!result.success) {
        notifyError(result.error || "Failed to save brand.");
        setError(result.error);
        return;
      }

      notifySuccess(brand ? "Brand saved." : "Brand created.");
      onSaved(result.brand);
      onOpenChange(false);
    });
  }

  return (
    <CmsDialog open={open} onOpenChange={handleOpenChange}>
      <CmsDialogContent className="max-w-lg">
        <CmsDialogHeader>
          <CmsDialogTitle>{isEdit ? "Edit brand" : "New brand"}</CmsDialogTitle>
          <CmsDialogDescription>
            {isEdit
              ? "Update brand details and control which CMS modules are enabled."
              : "Register a brand and choose the CMS modules it can use."}
          </CmsDialogDescription>
        </CmsDialogHeader>

        <form onSubmit={handleSubmit} className={DIALOG_FORM_CLASS}>
          <CmsDialogBody className="space-y-4">
            {brand?.logo ? (
              <div className="flex items-center gap-3 rounded-(--radius-inner) bg-muted/40 p-3">
                <div className="relative size-10 overflow-hidden rounded-lg bg-background">
                  <Image
                    src={brand.logo}
                    alt=""
                    fill
                    unoptimized
                    className="object-contain p-1"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Logo upload will be available in a later update.
                </p>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand name</Label>
              <Input
                id="brand-name"
                value={name}
                maxLength={BRAND_FORM_LIMITS.name}
                placeholder="e.g. Nusantara Labs"
                disabled={isPending}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-slug">Slug</Label>
              <Input
                id="brand-slug"
                value={slug}
                maxLength={BRAND_FORM_LIMITS.slug}
                placeholder="ganesha-consulting"
                disabled={isPending}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
              />
              <p className="text-muted-foreground text-xs">
                Used as the internal brand identifier.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-description">Description</Label>
              <Textarea
                id="brand-description"
                value={description}
                rows={3}
                maxLength={BRAND_FORM_LIMITS.description}
                placeholder="Optional internal note about this brand."
                disabled={isPending}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-status">Status</Label>
              <Select
                value={status}
                items={toSelectItems(BRAND_STATUSES)}
                onValueChange={(value) =>
                  setStatus(value as Brand["status"])
                }
                disabled={isPending}
              >
                <SelectTrigger id="brand-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRAND_STATUSES.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <BrandFormFeaturesField
              value={features}
              onChange={setFeatures}
              disabled={isPending}
            />

            {error ? (
              <CmsAlert variant="error" message={error} />
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Save changes" : "Create brand"}
            </Button>
          </CmsDialogFooter>
        </form>
      </CmsDialogContent>
    </CmsDialog>
  );
}
