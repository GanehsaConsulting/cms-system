"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ContentActivityFormFields } from "@/components/cms/content-activities/content-activity-form-fields";
import { ContentActivityFormHeader } from "@/components/cms/content-activities/content-activity-form-header";
import { ContentActivityFormPublishChecklist } from "@/components/cms/content-activities/content-activity-form-publish-checklist";
import { CmsAlert } from "@/components/shared/cms-alert";
import { CmsFormFieldGroup } from "@/components/shared/cms-form-field-group";
import { CmsFormSectionHeading } from "@/components/shared/cms-form-section-heading";
import { CmsPageShell } from "@/components/shared/cms-page-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CmsDeleteButton } from "@/components/shared/cms-delete-button";
import { SolidSurface } from "@/components/shared/solid-surface";
import { CONTENT_ACTIVITY_ACTION_CONFIRMATIONS } from "@/config/content-activity-form";
import { STACK_GAP } from "@/config/spacing";
import type { ArticleAuthorOption } from "@/lib/articles/authors";
import {
  createContentActivityAction,
  deleteContentActivityAction,
  updateContentActivityAction,
} from "@/lib/actions/content-activities";
import {
  contentActivityToFormInput,
  createEmptyContentActivityInput,
} from "@/lib/content-activities/defaults";
import { notifyError, runNotifiedAction } from "@/lib/notify/action-toast";
import {
  type ContentActivityFormValues,
  contentActivityFormSchema,
} from "@/lib/validations/content-activity";
import type { ContentActivity } from "@/types/content-activity";
import { cn } from "@/lib/utils";

interface ContentActivityFormProps {
  item?: ContentActivity;
  currentAuthor: ArticleAuthorOption;
}

export function ContentActivityForm({
  item,
  currentAuthor,
}: ContentActivityFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContentActivityFormValues>({
    resolver: zodResolver(contentActivityFormSchema),
    defaultValues: item
      ? contentActivityToFormInput(item)
      : createEmptyContentActivityInput(currentAuthor.name),
  });

  const { control, handleSubmit, watch, setValue, reset } = form;
  const watchedValues = watch();

  const publishChecklistValues = useMemo(
    () => ({
      title: watchedValues.title,
      content: watchedValues.content,
      displayAt: watchedValues.displayAt,
      images: watchedValues.images,
      showTitle: watchedValues.showTitle,
      linkUrl: watchedValues.linkUrl,
    }),
    [
      watchedValues.title,
      watchedValues.content,
      watchedValues.displayAt,
      watchedValues.images,
      watchedValues.showTitle,
      watchedValues.linkUrl,
    ],
  );

  function buildFormData(values: ContentActivityFormValues) {
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("excerpt", values.excerpt);
    formData.set("content", values.content);
    formData.set("displayAt", values.displayAt);
    formData.set("showTitle", String(values.showTitle));
    formData.set("kind", values.kind);
    formData.set("linkUrl", values.linkUrl);
    formData.set("status", values.status);
    formData.set("images", JSON.stringify(values.images));
    formData.set("authorName", values.authorName);
    return formData;
  }

  function onSubmit(values: ContentActivityFormValues) {
    setError(null);

    startTransition(async () => {
      const notified = await runNotifiedAction(
        () =>
          item
            ? updateContentActivityAction(item.id, buildFormData(values))
            : createContentActivityAction(buildFormData(values)),
        {
          success:
            values.status === "published"
              ? "Activity published."
              : "Activity saved.",
          errorFallback: "Failed to save activity.",
        },
      );
      if (!notified.ok) {
        setError("Failed to save activity.");
        return;
      }

      if (item) {
        reset(values);
        router.refresh();
      }
    });
  }

  function submitWithStatus(status: ContentActivityFormValues["status"]) {
    setValue("status", status, { shouldDirty: true, shouldValidate: false });
    void handleSubmit(onSubmit)();
  }

  function handleSaveDraft() {
    submitWithStatus("draft");
  }

  function handlePublish() {
    setValue("status", "published", { shouldDirty: true });
    void handleSubmit(
      (values) => onSubmit({ ...values, status: "published" }),
      () => notifyError("Please fix the highlighted fields before publishing."),
    )();
  }

  function handleDelete() {
    if (!item) {
      return;
    }

    startTransition(async () => {
      const notified = await runNotifiedAction(
        () => deleteContentActivityAction(item.id),
        {
          success: "Activity deleted.",
          errorFallback: "Failed to delete activity.",
        },
      );
      if (!notified.ok) {
        setDeleteOpen(false);
      }
    });
  }

  return (
    <CmsPageShell>
      <FormProvider {...form}>
        <form
          className={cn("flex min-h-0 flex-1 flex-col gap-4", STACK_GAP)}
          onSubmit={(event) => event.preventDefault()}
        >
          <ContentActivityFormHeader
            mode={item ? "edit" : "create"}
            title={watchedValues.title}
            isPending={isPending}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
          />

          {error ? <CmsAlert variant="error" title={error} /> : null}

          <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <SolidSurface className="min-h-0 overflow-y-auto p-4 sm:p-5">
              <CmsFormSectionHeading title="Content" />
              <CmsFormFieldGroup
                title="Details"
                description="Title, description, display date, and card settings."
                accent="content"
                className="mt-4"
              >
                <ContentActivityFormFields control={control} />
              </CmsFormFieldGroup>

              {item ? (
                <div className="mt-6 border-(--separator) border-t pt-4">
                  <CmsDeleteButton
                    type="button"
                    disabled={isPending}
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete activity
                  </CmsDeleteButton>
                </div>
              ) : null}
            </SolidSurface>

            <SolidSurface className="h-fit p-4 sm:p-5">
              <CmsFormSectionHeading title="Publish checklist" />
              <div className="mt-4">
                <ContentActivityFormPublishChecklist
                  values={publishChecklistValues}
                />
              </div>
            </SolidSurface>
          </div>
        </form>
      </FormProvider>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        {...CONTENT_ACTIVITY_ACTION_CONFIRMATIONS.delete}
        onConfirm={handleDelete}
        isPending={isPending}
      />
    </CmsPageShell>
  );
}
