"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ClientFormDangerZone } from "@/components/cms/clients/client-form-danger-zone";
import { ClientFormGallerySection } from "@/components/cms/clients/client-form-gallery-section";
import { ClientFormGeneralFields } from "@/components/cms/clients/client-form-general-fields";
import { ClientFormHeader } from "@/components/cms/clients/client-form-header";
import { ClientFormInfoPanel } from "@/components/cms/clients/client-form-info-panel";
import { ClientFormLogoField } from "@/components/cms/clients/client-form-logo-field";
import { ClientFormPublishChecklist } from "@/components/cms/clients/client-form-publish-checklist";
import { ClientFormSectionHeading } from "@/components/cms/clients/client-form-section-heading";
import { ClientFormTestimonialsSection } from "@/components/cms/clients/client-form-testimonials-section";
import { CmsAlert } from "@/components/shared/cms-alert";
import { CmsPageShell } from "@/components/shared/cms-page-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SolidSurface } from "@/components/shared/solid-surface";
import { CLIENT_ACTION_CONFIRMATIONS } from "@/config/client-actions";
import { STACK_GAP } from "@/config/spacing";
import {
  createClientAction,
  deleteClientAction,
  updateClientAction,
} from "@/lib/actions/clients";
import {
  clientToFormInput,
  createEmptyClientInput,
} from "@/lib/clients/defaults";
import { getClientFormChangedSections } from "@/lib/clients/form-changes";
import { runNotifiedAction } from "@/lib/notify/action-toast";
import {
  type ClientFormValues,
  clientFormSchema,
} from "@/lib/validations/client";
import type { Client } from "@/types/client";
import { cn } from "@/lib/utils";

interface ClientFormProps {
  client?: Client;
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: client ? clientToFormInput(client) : createEmptyClientInput(),
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = form;

  const testimonialsArray = useFieldArray({
    control,
    name: "testimonials",
  });

  const photosArray = useFieldArray({
    control,
    name: "photos",
  });

  const watchedValues = watch();

  const baselineValues = useMemo(
    () => (client ? clientToFormInput(client) : createEmptyClientInput()),
    [client],
  );

  const changedSections = useMemo(
    () =>
      client
        ? getClientFormChangedSections(baselineValues, watchedValues)
        : [],
    [baselineValues, client, watchedValues],
  );

  const hasUnsavedChanges =
    Boolean(client) && (isDirty || changedSections.length > 0);

  const publishChecklistValues = useMemo(
    () => ({
      name: watchedValues.name,
      logo: watchedValues.logo,
      website: watchedValues.website,
      description: watchedValues.description,
      testimonials: watchedValues.testimonials,
      photos: watchedValues.photos,
    }),
    [
      watchedValues.name,
      watchedValues.logo,
      watchedValues.website,
      watchedValues.description,
      watchedValues.testimonials,
      watchedValues.photos,
    ],
  );

  function buildFormData(values: ClientFormValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("logo", values.logo);
    formData.set("website", values.website);
    formData.set("description", values.description);
    formData.set("featured", String(values.featured));
    formData.set("testimonials", JSON.stringify(values.testimonials));
    formData.set("photos", JSON.stringify(values.photos));
    return formData;
  }

  function onSubmit(values: ClientFormValues) {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const notified = await runNotifiedAction(
        () =>
          client
            ? updateClientAction(client.id, buildFormData(values))
            : createClientAction(buildFormData(values)),
        {
          success: "Client saved.",
          errorFallback: "Failed to save client.",
        },
      );
      if (!notified.ok) {
        setError("Failed to save client.");
        return;
      }

      if (client) {
        setSuccess("Client saved successfully.");
        reset(values);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!client) return;

    startTransition(async () => {
      const notified = await runNotifiedAction(
        () => deleteClientAction(client.id),
        {
          success: "Client deleted.",
          errorFallback: "Failed to delete client.",
        },
      );
      if (!notified.ok) {
        setError("Failed to delete client.");
        setDeleteOpen(false);
      }
    });
  }

  const firstError =
    errors.name?.message ||
    errors.testimonials?.message ||
    errors.photos?.message;

  return (
    <>
      <CmsPageShell
        header={
          <ClientFormHeader
            mode={client ? "edit" : "create"}
            clientName={watchedValues.name.trim() || client?.name}
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
            <SolidSurface className="space-y-4 p-4 md:p-5">
              <ClientFormSectionHeading
                title="General"
                description="Core client identity used across the company profile."
                accent="plan"
              />
              <ClientFormGeneralFields control={control} />
              <ClientFormLogoField control={control} />
            </SolidSurface>

            <SolidSurface className="space-y-4 p-4 md:p-5">
              <ClientFormSectionHeading
                title="Testimonials"
                description="Optional quotes from this client. Leave empty if none."
                accent="content"
              />
              <ClientFormTestimonialsSection
                control={control}
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
                control={control}
                watch={watch}
                fields={photosArray.fields}
                append={photosArray.append}
                remove={photosArray.remove}
              />
            </SolidSurface>
          </div>

          <aside className={cn("flex flex-col", STACK_GAP)}>
            <SolidSurface className="space-y-4 p-4">
              <ClientFormInfoPanel
                client={client}
                changedSections={changedSections}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </SolidSurface>

            <ClientFormPublishChecklist values={publishChecklistValues} />

            {client ? (
              <ClientFormDangerZone
                isPending={isPending}
                onDelete={() => setDeleteOpen(true)}
              />
            ) : null}
          </aside>

          {(error || success || firstError) ? (
            <div className="space-y-2 xl:col-span-2">
              {error || firstError ? (
                <CmsAlert variant="error" message={error || firstError} />
              ) : null}
              {success ? (
                <CmsAlert variant="success" message={success} />
              ) : null}
            </div>
          ) : null}
        </form>
      </CmsPageShell>

      {client ? (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title={CLIENT_ACTION_CONFIRMATIONS.delete(client.name).title}
          description={
            CLIENT_ACTION_CONFIRMATIONS.delete(client.name).description
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
