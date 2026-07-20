"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { createClient } from "@/lib/db/clients";
import { createPortfolio } from "@/lib/db/portfolio";
import {
  clientFormSchema,
  clientFormToInput,
  parseClientForm,
} from "@/lib/validations/client";
import {
  portfolioFormSchema,
  portfolioFormToInput,
} from "@/lib/validations/portfolio";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";

function revalidateClientsPaths() {
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/clients/clients");
  revalidatePath("/clients/portfolio");
}

export async function createClientWithPortfolioAction(formData: FormData) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  const clientParsed = clientFormSchema.safeParse(parseClientForm(formData));

  if (!clientParsed.success) {
    return {
      success: false as const,
      error: clientParsed.error.issues[0]?.message ?? "Invalid client data",
    };
  }

  const workParsed = portfolioFormSchema.omit({ clientId: true }).safeParse({
    title: String(formData.get("title") ?? ""),
    workType: String(formData.get("workType") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    description: String(formData.get("workDescription") ?? ""),
    url: String(formData.get("url") ?? ""),
    featured: String(formData.get("workFeatured") ?? "false") === "true",
  });

  if (!workParsed.success) {
    return {
      success: false as const,
      error: workParsed.error.issues[0]?.message ?? "Invalid portfolio data",
    };
  }

  try {
    const client = await createClient(
      brand.brandId,
      clientFormToInput(clientParsed.data),
    );
    const item = await createPortfolio(
      brand.brandId,
      portfolioFormToInput({
        ...workParsed.data,
        clientId: client.id,
      }),
    );

    revalidateClientsPaths();
    redirect(`/clients/portfolio/${item.id}/edit`);
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create client and portfolio",
    };
  }
}
