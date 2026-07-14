import { z } from "zod";
import { PORTFOLIO_FORM_LIMITS } from "@/config/portfolio-form";
import type { PortfolioInput } from "@/types/portfolio";

export const portfolioFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(PORTFOLIO_FORM_LIMITS.title),
  clientId: z.string().trim().min(1, "Client is required"),
  workType: z.enum(["social-media", "website"], {
    message: "Select a work type",
  }),
  coverImage: z.string(),
  description: z.string().trim().max(PORTFOLIO_FORM_LIMITS.description),
  url: z.string().trim().max(PORTFOLIO_FORM_LIMITS.url),
  featured: z.boolean(),
});

export type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

export function portfolioFormToInput(
  values: PortfolioFormValues,
): PortfolioInput {
  return {
    title: values.title.trim(),
    clientId: values.clientId.trim(),
    workType: values.workType,
    coverImage: values.coverImage,
    description: values.description.trim(),
    url: values.url.trim(),
    featured: values.featured,
  };
}

export function parsePortfolioForm(formData: FormData): unknown {
  return {
    title: String(formData.get("title") ?? ""),
    clientId: String(formData.get("clientId") ?? ""),
    workType: String(formData.get("workType") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    description: String(formData.get("description") ?? ""),
    url: String(formData.get("url") ?? ""),
    featured: String(formData.get("featured") ?? "false") === "true",
  };
}
