import type { FieldError, FieldErrors } from "react-hook-form";
import { SITE_LOCALES } from "@/lib/locale";
import type { PriceFormValues } from "@/lib/validations/price";
import type { SiteLocale } from "@/types/locale";

type FeatureNameErrors = {
  message?: string;
  id?: FieldError;
  en?: FieldError;
  zh?: FieldError;
};

type FeatureItemErrors = {
  name?: FeatureNameErrors;
};

function messageOf(error: { message?: string } | undefined): string | undefined {
  return error?.message || undefined;
}

function featureItems(
  errors: FieldErrors<PriceFormValues>,
): FeatureItemErrors[] {
  const features = errors.features;
  if (!Array.isArray(features)) {
    return [];
  }

  return features.filter(Boolean) as FeatureItemErrors[];
}

function firstFeatureMessage(
  errors: FieldErrors<PriceFormValues>,
): string | undefined {
  for (const feature of featureItems(errors)) {
    const message =
      messageOf(feature.name) ||
      messageOf(feature.name?.id) ||
      messageOf(feature.name?.en) ||
      messageOf(feature.name?.zh);
    if (message) {
      return message;
    }
  }
  return undefined;
}

/** First human-readable validation message for toast / banner. */
export function getFirstPriceFormError(
  errors: FieldErrors<PriceFormValues>,
): string | undefined {
  return (
    messageOf(errors.serviceSlug) ||
    messageOf(errors.packageName) ||
    messageOf(errors.packageName?.id) ||
    messageOf(errors.packageName?.en) ||
    messageOf(errors.packageName?.zh) ||
    messageOf(errors.description) ||
    messageOf(errors.description?.id) ||
    messageOf(errors.description?.en) ||
    messageOf(errors.description?.zh) ||
    messageOf(errors.whatsappPhone) ||
    messageOf(errors.whatsappMessage) ||
    messageOf(errors.whatsappMessage?.id) ||
    messageOf(errors.whatsappMessage?.en) ||
    messageOf(errors.whatsappMessage?.zh) ||
    messageOf(errors.price) ||
    messageOf(errors.strikethroughPrice) ||
    messageOf(errors.features as FieldError | undefined) ||
    firstFeatureMessage(errors) ||
    messageOf(errors.service) ||
    undefined
  );
}

function localeHasError(
  errors: FieldErrors<PriceFormValues>,
  locale: SiteLocale,
): boolean {
  if (
    messageOf(errors.packageName) ||
    messageOf(errors.whatsappMessage) ||
    messageOf(errors.features as FieldError | undefined)
  ) {
    return true;
  }

  if (
    messageOf(errors.packageName?.[locale]) ||
    messageOf(errors.description?.[locale]) ||
    messageOf(errors.whatsappMessage?.[locale])
  ) {
    return true;
  }

  return featureItems(errors).some((feature) =>
    Boolean(messageOf(feature.name) || messageOf(feature.name?.[locale])),
  );
}

export function getPriceFormErrorLocales(
  errors: FieldErrors<PriceFormValues>,
): SiteLocale[] {
  return SITE_LOCALES.filter((locale) => localeHasError(errors, locale));
}
