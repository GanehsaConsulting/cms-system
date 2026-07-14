"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PortfolioFormCoverField } from "@/components/cms/portfolio/portfolio-form-cover-field";
import { PortfolioFormFields } from "@/components/cms/portfolio/portfolio-form-fields";
import { PortfolioFormHeader } from "@/components/cms/portfolio/portfolio-form-header";
import { CmsPageShell } from "@/components/shared/cms-page-shell";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_ACTION_CONFIRMATIONS } from "@/config/portfolio-form";
import { STACK_GAP } from "@/config/spacing";
import {
  createPortfolioAction,
  deletePortfolioAction,
  updatePortfolioAction,
} from "@/lib/actions/portfolio";
import {
  createEmptyPortfolioInput,
  portfolioToFormInput,
} from "@/lib/portfolio/defaults";
import {
  type PortfolioFormValues,
  portfolioFormSchema,
} from "@/lib/validations/portfolio";
import type { Client } from "@/types/client";
import type { Portfolio } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface PortfolioFormProps {
  item?: Portfolio;
  clients: Client[];
  defaultClientId?: string;
}

export function PortfolioForm({
  item,
  clients,
  defaultClientId = "",
}: PortfolioFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: item
      ? portfolioToFormInput(item)
      : createEmptyPortfolioInput(defaultClientId),
  });

  const {
    control,
    handleSubmit,
    watch,
  } = form;

  const watchedTitle = watch("title");

  function onSubmit(values: PortfolioFormValues) {
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("clientId", values.clientId);
    formData.set("workType", values.workType);
    formData.set("coverImage", values.coverImage);
    formData.set("description", values.description);
    formData.set("url", values.url);
    formData.set("featured", values.featured ? "true" : "false");

    startTransition(async () => {
      const result = item
        ? await updatePortfolioAction(item.id, formData)
        : await createPortfolioAction(formData);

      if (result && !result.success) {
        setError(result.error);
        return;
      }

      if (item) {
        setSuccess("Work saved.");
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!item) {
      return;
    }

    startTransition(async () => {
      const result = await deletePortfolioAction(item.id);
      if (result && !result.success) {
        setError(result.error);
        setDeleteOpen(false);
      }
    });
  }

  return (
    <>
      <CmsPageShell
        header={
          <PortfolioFormHeader
            mode={item ? "edit" : "create"}
            title={watchedTitle}
            isPending={isPending}
            onSave={() => void handleSubmit(onSubmit)()}
          />
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn("flex flex-col", STACK_GAP)}
        >
          <SolidSurface className="space-y-5 p-4 sm:p-5">
            <PortfolioFormFields control={control} clients={clients} />
            <PortfolioFormCoverField control={control} />
          </SolidSurface>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          {success ? <p className="text-emerald-600 text-sm">{success}</p> : null}

          {item ? (
            <SolidSurface className="space-y-3 p-4 sm:p-5">
              <div>
                <h2 className="font-semibold text-sm">Danger zone</h2>
                <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                  Permanently remove this portfolio work.
                </p>
              </div>
              <Button
                type="button"
                variant="destructive"
                className="h-9"
                disabled={isPending}
                onClick={() => setDeleteOpen(true)}
              >
                Delete work
              </Button>
            </SolidSurface>
          ) : null}
        </form>
      </CmsPageShell>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={PORTFOLIO_ACTION_CONFIRMATIONS.delete.title}
        description={PORTFOLIO_ACTION_CONFIRMATIONS.delete.description}
        confirmLabel={PORTFOLIO_ACTION_CONFIRMATIONS.delete.confirmLabel}
        variant="destructive"
        isPending={isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
