"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { recordActivityEvent } from "@/lib/activity/record";
import {
  createClient,
  deleteClient,
  getClientById,
  updateClient,
} from "@/lib/db/clients";
import { deletePortfolioByClientId } from "@/lib/db/portfolio";
import { revalidateMediaLibraryCache } from "@/lib/media/cache";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import {
  clientFormSchema,
  clientFormToInput,
  parseClientForm,
} from "@/lib/validations/client";

function revalidateClientPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/clients/clients");
  revalidatePath("/clients/portfolio");
  if (id) {
    revalidatePath(`/clients/${id}/edit`);
  }
  revalidateMediaLibraryCache();
}
export async function createClientAction(formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = clientFormSchema.safeParse(parseClientForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid client data",
    };
  }

  try {
    const client = await createClient(brand.brandId, clientFormToInput(parsed.data));
    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "client",
      entityId: client.id,
      action: "created",
      actor: access.user,
      entityTitle: client.name,
    });
    revalidateClientPaths();
    redirect(`/clients/${client.id}/edit`);
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to save client",
    };
  }
}

export async function updateClientAction(id: string, formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const parsed = clientFormSchema.safeParse(parseClientForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid client data",
    };
  }

  try {
    const current = await getClientById(brand.brandId, id);
    await updateClient(brand.brandId, id, clientFormToInput(parsed.data));
    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "client",
      entityId: id,
      action: "updated",
      actor: access.user,
      entityTitle: parsed.data.name.trim() || current?.name || "Client",
    });
    revalidateClientPaths(id);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update client",
    };
  }
}

export async function deleteClientAction(id: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    const current = await getClientById(brand.brandId, id);
    await deletePortfolioByClientId(brand.brandId, id);
    await deleteClient(brand.brandId, id);
    if (current) {
      await recordActivityEvent({
        brandId: brand.brandId,
        entityType: "client",
        entityId: id,
        action: "deleted",
        actor: access.user,
        entityTitle: current.name,
      });
    }
    revalidateClientPaths();
    redirect("/clients/clients");
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete client",
    };
  }
}
