"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PriceFormDangerZone } from "@/components/cms/prices/price-form-danger-zone";
import { PriceFormHeader } from "@/components/cms/prices/price-form-header";
import { PriceFormInfoPanel } from "@/components/cms/prices/price-form-info-panel";
import { PriceFormLocaleFields } from "@/components/cms/prices/price-form-locale-fields";
import { PriceFormLocaleTabs } from "@/components/cms/prices/price-form-locale-tabs";
import { PriceFormMetaFields } from "@/components/cms/prices/price-form-meta-fields";
import { PriceFormPricingFields } from "@/components/cms/prices/price-form-pricing-fields";
import { PriceFormPublishChecklist } from "@/components/cms/prices/price-form-publish-checklist";
import { PriceFormSectionHeading } from "@/components/cms/prices/price-form-section-heading";
import { PriceFormStatusField } from "@/components/cms/prices/price-form-status-field";
import { PricePreviewDialog } from "@/components/cms/prices/price-preview-dialog";
import { CmsAlert } from "@/components/shared/cms-alert";
import { CmsPageShell } from "@/components/shared/cms-page-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SolidSurface } from "@/components/shared/solid-surface";
import { PRICE_ACTION_CONFIRMATIONS } from "@/config/price-actions";
import { STACK_GAP } from "@/config/spacing";
import {
  createPriceAction,
  deletePriceAction,
  updatePriceAction,
} from "@/lib/actions/prices";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import { priceToFormInput, createEmptyPriceInput } from "@/lib/prices/defaults";
import { getPriceFormChangedSections } from "@/lib/prices/form-changes";
import { buildWhatsAppUrl } from "@/lib/prices/whatsapp";
import { isLocaleTabComplete, SITE_LOCALES } from "@/lib/locale";
import { type PriceFormValues, priceFormSchema } from "@/lib/validations/price";
import type { Price } from "@/types/price";
import type { PriceCategory } from "@/types/price-category";
import type { PricePreviewData } from "@/types/price-preview";
import type { SiteLocale } from "@/types/locale";
import { cn } from "@/lib/utils";

interface PriceFormProps {
  price?: Price;
  categories: PriceCategory[];
}

export function PriceForm({ price, categories }: PriceFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState<SiteLocale>("id");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [availableCategories, setAvailableCategories] =
    useState<PriceCategory[]>(categories);

  useEffect(() => {
    setAvailableCategories(categories);
  }, [categories]);

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: price ? priceToFormInput(price) : createEmptyPriceInput(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = form;

  const watchedValues = watch();

  useEffect(() => {
    const category = availableCategories.find(
      (item) => item.id === watchedValues.serviceSlug,
    );
    if (!category) {
      return;
    }

    const nextService = {
      id: category.label,
      en: category.label,
      zh: category.label,
    };
    const current = watchedValues.service;
    if (
      current.id === nextService.id &&
      current.en === nextService.en &&
      current.zh === nextService.zh
    ) {
      return;
    }

    setValue("service", nextService, {
      shouldDirty: false,
      shouldValidate: true,
    });
  }, [
    availableCategories,
    setValue,
    watchedValues.service,
    watchedValues.serviceSlug,
  ]);

  const baselineValues = useMemo(
    () => (price ? priceToFormInput(price) : createEmptyPriceInput()),
    [price],
  );

  const changedSections = useMemo(
    () =>
      price
        ? getPriceFormChangedSections(baselineValues, watchedValues)
        : [],
    [baselineValues, price, watchedValues],
  );

  const hasUnsavedChanges = Boolean(price) && (isDirty || changedSections.length > 0);

  const incompleteLocales = useMemo(() => {
    return SITE_LOCALES.filter((locale) => {
      const hasCoreFields =
        isLocaleTabComplete(watchedValues.packageName, locale) &&
        isLocaleTabComplete(watchedValues.whatsappMessage, locale);

      const hasFeatures =
        watchedValues.features.length > 0 &&
        watchedValues.features.every((feature) =>
          isLocaleTabComplete(feature.name, locale),
        );

      return !(hasCoreFields && hasFeatures);
    });
  }, [watchedValues]);

  const publishChecklistValues = useMemo(
    () => ({
      serviceSlug: watchedValues.serviceSlug,
      description: watchedValues.description,
      packageName: watchedValues.packageName,
      price: watchedValues.price,
      whatsappPhone: watchedValues.whatsappPhone,
      whatsappMessage: watchedValues.whatsappMessage,
      features: watchedValues.features,
    }),
    [
      watchedValues.serviceSlug,
      watchedValues.description,
      watchedValues.packageName,
      watchedValues.price,
      watchedValues.whatsappPhone,
      watchedValues.whatsappMessage,
      watchedValues.features,
    ],
  );

  const previewData = useMemo<PricePreviewData>(() => {
    const packageName =
      watchedValues.packageName[activeLocale].trim() ||
      watchedValues.packageName.en.trim() ||
      watchedValues.packageName.id.trim();
    const categoryLabel =
      availableCategories.find(
        (category) => category.id === watchedValues.serviceSlug,
      )?.label ?? "";

    return {
      title: packageName || categoryLabel,
      price: watchedValues.price,
      strikethroughPrice: watchedValues.strikethroughPrice,
      features: watchedValues.features
        .map((feature) => feature.name[activeLocale].trim())
        .filter(Boolean),
      whatsappLink: buildWhatsAppUrl(
        watchedValues.whatsappPhone,
        watchedValues.whatsappMessage[activeLocale],
      ),
      highlighted: watchedValues.highlighted,
    };
  }, [activeLocale, availableCategories, watchedValues]);

  function buildFormData(values: PriceFormValues) {
    const formData = new FormData();
    formData.set("serviceSlug", values.serviceSlug);
    formData.set("category", values.serviceSlug);
    formData.set("highlighted", String(values.highlighted));
    formData.set("description", JSON.stringify(values.description));
    formData.set("service", JSON.stringify(values.service));
    formData.set("packageName", JSON.stringify(values.packageName));
    formData.set("price", String(values.price));
    formData.set("strikethroughPrice", String(values.strikethroughPrice));
    formData.set("whatsappPhone", values.whatsappPhone);
    formData.set("whatsappMessage", JSON.stringify(values.whatsappMessage));
    formData.set("isActive", String(values.isActive));
    formData.set("features", JSON.stringify(values.features));
    return formData;
  }

  function onSubmit(values: PriceFormValues) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const notified = await runNotifiedAction(
        () =>
          price
            ? updatePriceAction(price.id, buildFormData(values))
            : createPriceAction(buildFormData(values)),
        {
          success: "Price plan saved.",
          errorFallback: "Failed to save price plan.",
        },
      );
      if (!notified.ok) {
        setError("Failed to save price plan.");
        return;
      }

      if (price) {
        setSuccess("Price plan saved successfully.");
        reset(values);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!price) return;

    startTransition(async () => {
      const notified = await runNotifiedAction(
        () => deletePriceAction(price.id),
        {
          success: "Price plan deleted.",
          errorFallback: "Failed to delete price plan.",
        },
      );
      if (!notified.ok) {
        setError("Failed to delete price plan.");
        setDeleteOpen(false);
      }
    });
  }

  const firstError =
    errors.serviceSlug?.message ||
    errors.service?.message ||
    errors.packageName?.message ||
    errors.whatsappPhone?.message ||
    errors.whatsappMessage?.message ||
    errors.price?.message ||
    errors.features?.message ||
    errors.strikethroughPrice?.message;

  return (
    <>
      <CmsPageShell
        header={
          <PriceFormHeader
            mode={price ? "edit" : "create"}
            planName={
              watchedValues.packageName.en.trim() ||
              watchedValues.packageName.id.trim() ||
              price?.packageName.en ||
              price?.packageName.id
            }
            isPending={isPending}
            onPreview={() => setPreviewOpen(true)}
            onSave={() => void handleSubmit(onSubmit)()}
          />
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_18rem]"
        >
          <div className={cn("flex flex-col", STACK_GAP)}>
            <SolidSurface className="space-y-4 p-4 md:p-5">
              <PriceFormSectionHeading
                title="Plan details"
                description="Placement and featured status for this pricing card."
                accent="plan"
              />
              <PriceFormMetaFields
                control={control}
                categories={availableCategories}
                onCategoriesChange={setAvailableCategories}
              />
            </SolidSurface>

            <SolidSurface className="space-y-6 p-4 md:p-5">
              <PriceFormSectionHeading
                title="Languages & content"
                description="Copy, WhatsApp CTA, and features for each language."
                accent="content"
              />
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
            </SolidSurface>
          </div>

          <aside className={cn("flex flex-col", STACK_GAP)}>
            <SolidSurface className="space-y-4 p-4">
              <PriceFormInfoPanel
                price={price}
                changedSections={changedSections}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </SolidSurface>

            <PriceFormPublishChecklist values={publishChecklistValues} />

            <SolidSurface className="space-y-4 p-4">
              <PriceFormSectionHeading
                title="Publication"
                description="Control visibility on the company profile site."
                accent="publication"
              />
              <PriceFormStatusField control={control} />
            </SolidSurface>

            <SolidSurface className="space-y-6 p-4 md:p-5">
              <PriceFormSectionHeading
                title="Pricing"
                description="Amounts in Indonesian Rupiah (IDR)."
                accent="pricing"
              />
              <PriceFormPricingFields control={control} watch={watch} />
            </SolidSurface>

            {price ? (
              <PriceFormDangerZone
                isPending={isPending}
                onDelete={() => setDeleteOpen(true)}
              />
            ) : null}
          </aside>

          {error || firstError ? (
            <CmsAlert
              variant="error"
              message={error ?? firstError}
              className="xl:col-span-2"
            />
          ) : null}

          {success ? (
            <CmsAlert
              variant="success"
              message={success}
              className="xl:col-span-2"
            />
          ) : null}
        </form>
      </CmsPageShell>

      <PricePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={previewData}
      />

      {price ? (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title={
            PRICE_ACTION_CONFIRMATIONS.delete(
              watchedValues.packageName.en ||
                watchedValues.packageName.id ||
                "this plan",
            ).title
          }
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
