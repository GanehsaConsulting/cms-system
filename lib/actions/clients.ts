"use server";

import { toActionError } from "@/lib/actions/action-error";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { recordActivityEvent } from "@/lib/activity/record";
import {
  createClient,
  getClientById,
  setClientsFeatured,
  softDeleteClient,
  softDeleteClients,
  updateClient,
} from "@/lib/db/clients";
import { softDeletePortfolioByClientId, softDeletePortfolioByClientIds } from "@/lib/db/portfolio";
import { revalidateMediaLibraryCache } from "@/lib/media/cache";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import {
  clientFormSchema,
  clientFormToInput,
  parseClientForm,
} from "@/lib/validations/client";

function normalizeIdList(ids: string[]) {
  return [...new Set(ids.map((id) => id.trim()).filter((id) => id.length > 0))];
}

function revalidateClientPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/clients/clients");
  revalidatePath("/clients/portfolio");
  revalidatePath("/trash");
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
    return toActionError(error, "Failed to save client");
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
    return toActionError(error, "Failed to update client");
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
    await softDeletePortfolioByClientId(brand.brandId, id);
    await softDeleteClient(brand.brandId, id);
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
    return toActionError(error, "Failed to move client to Trash");
  }
}

export async function setClientsFeaturedAction(
  ids: string[],
  featured: boolean,
) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const uniqueIds = normalizeIdList(ids);
  if (uniqueIds.length === 0) {
    return { success: false as const, error: "No clients selected." };
  }

  try {
    const updatedCount = await setClientsFeatured(
      brand.brandId,
      uniqueIds,
      featured,
    );
    if (updatedCount === 0) {
      return { success: false as const, error: "No matching clients found." };
    }

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "client",
      entityId: uniqueIds[0] ?? "batch",
      action: "updated",
      actor: access.user,
      entityTitle:
        updatedCount === 1
          ? featured
            ? "1 client featured"
            : "1 client unfeatured"
          : featured
            ? `${updatedCount} clients featured`
            : `${updatedCount} clients unfeatured`,
      href: "/clients/clients",
    });
    revalidateClientPaths();
    return { success: true as const, updatedCount };
  } catch (error) {
    return toActionError(error, "Failed to update clients");
  }
}

export async function deleteClientsAction(ids: string[]) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const uniqueIds = normalizeIdList(ids);
  if (uniqueIds.length === 0) {
    return { success: false as const, error: "No clients selected." };
  }

  try {
    await softDeletePortfolioByClientIds(brand.brandId, uniqueIds);
    const deletedCount = await softDeleteClients(brand.brandId, uniqueIds);

    if (deletedCount === 0) {
      return { success: false as const, error: "No matching clients found." };
    }

    await recordActivityEvent({
      brandId: brand.brandId,
      entityType: "client",
      entityId: uniqueIds[0] ?? "batch",
      action: "deleted",
      actor: access.user,
      entityTitle:
        deletedCount === 1 ? "1 client" : `${deletedCount} clients`,
      href: "/trash",
    });
    revalidateClientPaths();
    return { success: true as const, deletedCount };
  } catch (error) {
    return toActionError(error, "Failed to move clients to Trash");
  }
}
