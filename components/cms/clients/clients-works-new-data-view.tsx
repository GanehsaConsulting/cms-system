"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ClientFormGallerySection } from "@/components/cms/clients/client-form-gallery-section";
import { ClientFormGeneralFields } from "@/components/cms/clients/client-form-general-fields";
import { ClientFormLogoField } from "@/components/cms/clients/client-form-logo-field";
import { ClientFormSectionHeading } from "@/components/cms/clients/client-form-section-heading";
import { ClientFormTestimonialsSection } from "@/components/cms/clients/client-form-testimonials-section";
import { ClientsWorksNewDataHeader } from "@/components/cms/clients/clients-works-new-data-header";
import { PortfolioFormCoverField } from "@/components/cms/portfolio/portfolio-form-cover-field";
import { PortfolioFormFields } from "@/components/cms/portfolio/portfolio-form-fields";
import { CmsPageShell } from "@/components/shared/cms-page-shell";
import { SolidSurface } from "@/components/shared/solid-surface";
import { STACK_GAP } from "@/config/spacing";
import { createClientWithPortfolioAction } from "@/lib/actions/clients-works";
import { createEmptyClientInput } from "@/lib/clients/defaults";
import { createEmptyPortfolioInput } from "@/lib/portfolio/defaults";
import {
  type ClientFormValues,
  clientFormSchema,
} from "@/lib/validations/client";
import {
  type PortfolioFormValues,
  portfolioFormSchema,
} from "@/lib/validations/portfolio";
import { cn } from "@/lib/utils";

export function ClientsWorksNewDataView() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: createEmptyClientInput(),
  });

  const workForm = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: createEmptyPortfolioInput("pending"),
  });

  const testimonialsArray = useFieldArray({
    control: clientForm.control,
    name: "testimonials",
  });

  const photosArray = useFieldArray({
    control: clientForm.control,
    name: "photos",
  });

  function onSave() {
    setError(null);

    void clientForm.handleSubmit((clientValues) => {
      void workForm.handleSubmit((workValues) => {
        startTransition(async () => {
          const formData = new FormData();
          formData.set("name", clientValues.name);
          formData.set("logo", clientValues.logo);
          formData.set("website", clientValues.website);
          formData.set("description", clientValues.description);
          formData.set("featured", String(clientValues.featured));
          formData.set(
            "testimonials",
            JSON.stringify(clientValues.testimonials),
          );
          formData.set("photos", JSON.stringify(clientValues.photos));
          formData.set("title", workValues.title);
          formData.set("workType", workValues.workType);
          formData.set("coverImage", workValues.coverImage);
          formData.set("workDescription", workValues.description);
          formData.set("url", workValues.url);
          formData.set(
            "workFeatured",
            workValues.featured ? "true" : "false",
          );

          const result = await createClientWithPortfolioAction(formData);
          if (result && !result.success) {
            setError(result.error);
          }
        });
      })();
    })();
  }

  return (
    <CmsPageShell
      header={
        <ClientsWorksNewDataHeader
          isPending={isPending}
          onSave={onSave}
        />
      }
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className={cn("flex flex-col", STACK_GAP)}
      >
        <SolidSurface className="space-y-4 p-4 md:p-5">
          <ClientFormSectionHeading
            title="General"
            description="Core client identity used across the company profile."
            accent="plan"
          />
          <ClientFormGeneralFields control={clientForm.control} />
          <ClientFormLogoField control={clientForm.control} />
        </SolidSurface>

        <SolidSurface className="space-y-4 p-4 md:p-5">
          <ClientFormSectionHeading
            title="Testimonials"
            description="Optional quotes from this client. Leave empty if none."
            accent="content"
          />
          <ClientFormTestimonialsSection
            control={clientForm.control}
            fields={testimonialsArray.fields}
            append={testimonialsArray.append}
            remove={testimonialsArray.remove}
          />
        </SolidSurface>

        <SolidSurface className="space-y-4 p-4 md:p-5">
          <ClientFormSectionHeading
            title="Gallery"
            description="Optional photo assets for this client. Leave empty if none."
            accent="media"
          />
          <ClientFormGallerySection
            control={clientForm.control}
            watch={clientForm.watch}
            fields={photosArray.fields}
            append={photosArray.append}
            remove={photosArray.remove}
          />
        </SolidSurface>

        <SolidSurface className="space-y-4 p-4 md:p-5">
          <ClientFormSectionHeading
            title="Portfolio"
            description="Social media or website work linked to this client."
            accent="content"
          />
          <PortfolioFormFields
            control={workForm.control}
            clients={[]}
            hideClientField
          />
          <PortfolioFormCoverField control={workForm.control} />
        </SolidSurface>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </CmsPageShell>
  );
}
