"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPrice, deletePrice, updatePrice } from "@/lib/db/prices";
import {
  parsePriceForm,
  priceFormSchema,
  priceFormToInput,
} from "@/lib/validations/price";

export async function createPriceAction(formData: FormData) {
  const parsed = priceFormSchema.safeParse(parsePriceForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid price data",
    };
  }

  try {
    const price = await createPrice(priceFormToInput(parsed.data));
    revalidatePath("/");
    revalidatePath("/prices");
    redirect(`/prices/${price.id}/edit`);
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to save price plan",
    };
  }
}

export async function updatePriceAction(id: string, formData: FormData) {
  const parsed = priceFormSchema.safeParse(parsePriceForm(formData));

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid price data",
    };
  }

  try {
    await updatePrice(id, priceFormToInput(parsed.data));
    revalidatePath("/");
    revalidatePath("/prices");
    revalidatePath(`/prices/${id}/edit`);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update price plan",
    };
  }
}

export async function deletePriceAction(id: string) {
  try {
    await deletePrice(id);
    revalidatePath("/");
    revalidatePath("/prices");
    redirect("/prices");
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete price plan",
    };
  }
}
