"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PriceFormHeader } from "@/components/cms/prices/price-form-header";
import { PriceFormLocaleFields } from "@/components/cms/prices/price-form-locale-fields";
import { PriceFormLocaleTabs } from "@/components/cms/prices/price-form-locale-tabs";
import { PriceFormMetaFields } from "@/components/cms/prices/price-form-meta-fields";
import { PriceFormPricingFields } from "@/components/cms/prices/price-form-pricing-fields";
import { PriceFormStatusField } from "@/components/cms/prices/price-form-status-field";
import { CmsPageShell } from "@/components/shared/cms-page-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { GlassSurface } from "@/components/shared/glass-surface";
import { Button } from "@/components/ui/button";
import { PRICE_ACTION_CONFIRMATIONS } from "@/config/price-actions";
import { STACK_GAP } from "@/config/spacing";
import { RADIUS_DEEP } from "@/config/shape";
import {
  createPriceAction,
  deletePriceAction,
  updatePriceAction,
} from "@/lib/actions/prices";
import { priceToFormInput, createEmptyPriceInput } from "@/lib/prices/defaults";
import { isLocaleTabComplete, SITE_LOCALES } from "@/lib/locale";
import {
  type PriceFormValues,
  priceFormSchema,
} from "@/lib/validations/price";
import type { Price } from "@/types/price";
import type { SiteLocale } from "@/types/locale";
import { cn } from "@/lib/utils";

interface PriceFormProps {
  price?: Price;
}

export function PriceForm({ price }: PriceFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState<SiteLocale>("en");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: price ? priceToFormInput(price) : createEmptyPriceInput(),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const watchedValues = watch();

  const incompleteLocales = useMemo(() => {
    return SITE_LOCALES.filter((locale) => {
      const hasCoreFields =
        isLocaleTabComplete(watchedValues.service, locale) &&
        isLocaleTabComplete(watchedValues.packageName, locale) &&
        isLocaleTabComplete(watchedValues.whatsappLink, locale);

      const hasFeatures =
        watchedValues.features.length > 0 &&
        watchedValues.features.every((feature) =>
          isLocaleTabComplete(feature.name, locale),
        );

      return !(hasCoreFields && hasFeatures);
    });
  }, [watchedValues]);

  function buildFormData(values: PriceFormValues) {
    const formData = new FormData();
    formData.set("slug", values.slug);
    formData.set("serviceSlug", values.serviceSlug);
    formData.set("category", values.category);
    formData.set("highlighted", String(values.highlighted));
    formData.set("description", JSON.stringify(values.description));
    formData.set("service", JSON.stringify(values.service));
    formData.set("packageName", JSON.stringify(values.packageName));
    formData.set("price", String(values.price));
    formData.set("strikethroughPrice", String(values.strikethroughPrice));
    formData.set("whatsappLink", JSON.stringify(values.whatsappLink));
    formData.set("isActive", String(values.isActive));
    formData.set("features", JSON.stringify(values.features));
    return formData;
  }

  function onSubmit(values: PriceFormValues) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = price
        ? await updatePriceAction(price.id, buildFormData(values))
        : await createPriceAction(buildFormData(values));

      if (result && !result.success) {
        setError(result.error);
        return;
      }

      if (price) {
        setSuccess("Price plan saved successfully.");
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!price) return;

    startTransition(async () => {
      const result = await deletePriceAction(price.id);
      if (result && !result.success) {
        setError(result.error);
        setDeleteOpen(false);
      }
    });
  }

  const firstError =
    errors.service?.message ||
    errors.packageName?.message ||
    errors.whatsappLink?.message ||
    errors.price?.message ||
    errors.features?.message ||
    errors.strikethroughPrice?.message;

  return (
    <>
      <CmsPageShell
        header={
          <PriceFormHeader
            mode={price ? "edit" : "create"}
            isPending={isPending}
            onSave={() => void handleSubmit(onSubmit)()}
          />
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_18rem]"
        >
          <div className={cn("flex flex-col", STACK_GAP)}>
            <GlassSurface className="space-y-6 p-4 md:p-5">
              <div>
                <h2 className="font-semibold text-sm">Plan details</h2>
                <p className="mt-1 text-muted-foreground text-xs">
                  Slugs and grouping fields used by the public pricing page.
                </p>
              </div>
              <PriceFormMetaFields control={control} />
            </GlassSurface>

            <GlassSurface className="space-y-6 p-4 md:p-5">
              <PriceFormLocaleTabs
                activeLocale={activeLocale}
                incompleteLocales={incompleteLocales}
                onLocaleChange={setActiveLocale}
              />
              <PriceFormLocaleFields
                control={control}
                watch={watch}
                locale={activeLocale}
              />
            </GlassSurface>

            <GlassSurface className="space-y-6 p-4 md:p-5">
              <div>
                <h2 className="font-semibold text-sm">Pricing</h2>
                <p className="mt-1 text-muted-foreground text-xs">
                  Amounts in Indonesian Rupiah (IDR).
                </p>
              </div>
              <PriceFormPricingFields control={control} watch={watch} />
            </GlassSurface>
          </div>

          <aside className={cn("flex flex-col", STACK_GAP)}>
            <GlassSurface className="space-y-4 p-4">
              <div>
                <h2 className="font-semibold text-sm">Publication</h2>
                <p className="mt-1 text-muted-foreground text-xs">
                  Control visibility on the company profile site.
                </p>
              </div>
              <PriceFormStatusField control={control} />
            </GlassSurface>

            {price ? (
              <GlassSurface className="p-4">
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => setDeleteOpen(true)}
                >
                  Delete Price Plan
                </Button>
              </GlassSurface>
            ) : null}
          </aside>

          {error || firstError ? (
            <p
              className={cn(
                RADIUS_DEEP,
                "border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm xl:col-span-2",
              )}
            >
              {error ?? firstError}
            </p>
          ) : null}

          {success ? (
            <p
              className={cn(
                RADIUS_DEEP,
                "border border-border bg-muted px-3 py-2 text-muted-foreground text-sm xl:col-span-2",
              )}
            >
              {success}
            </p>
          ) : null}
        </form>
      </CmsPageShell>

      {price ? (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title={PRICE_ACTION_CONFIRMATIONS.delete(
            watchedValues.packageName.en ||
              watchedValues.packageName.id ||
              "this plan",
          ).title}
          description={
            PRICE_ACTION_CONFIRMATIONS.delete(
              watchedValues.packageName.en ||
                watchedValues.packageName.id ||
                "this plan",
            ).description
          }
          confirmLabel="Delete"
          variant="destructive"
          isPending={isPending}
          onConfirm={handleDelete}
        />
      ) : null}
    </>
  );
}
