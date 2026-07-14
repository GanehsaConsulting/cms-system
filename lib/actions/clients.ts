"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createClient,
  deleteClient,
  updateClient,
} from "@/lib/db/clients";
import { deletePortfolioByClientId } from "@/lib/db/portfolio";
import {
  clientFormSchema,
  clientFormToInput,
  parseClientForm,
} from "@/lib/validations/client";

export async function createClientAction(formData: FormData) {
  const parsed = clientFormSchema.safeParse(parseClientForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid client data",
    };
  }

  try {
    const client = await createClient(clientFormToInput(parsed.data));
    revalidatePath("/");
    revalidatePath("/clients");
    revalidatePath("/clients/clients");
    revalidatePath("/clients/portfolio");
    redirect(`/clients/${client.id}/edit`);
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to save client",
    };
  }
}

export async function updateClientAction(id: string, formData: FormData) {
  const parsed = clientFormSchema.safeParse(parseClientForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid client data",
    };
  }

  try {
    await updateClient(id, clientFormToInput(parsed.data));
    revalidatePath("/");
    revalidatePath("/clients");
    revalidatePath("/clients/clients");
    revalidatePath(`/clients/${id}/edit`);
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
  try {
    await deletePortfolioByClientId(id);
    await deleteClient(id);
    revalidatePath("/");
    revalidatePath("/clients");
    revalidatePath("/clients/clients");
    revalidatePath("/clients/portfolio");
    redirect("/clients/clients");
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete client",
    };
  }
}
