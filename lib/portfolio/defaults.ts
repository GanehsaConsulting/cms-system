import type { PortfolioFormValues } from "@/lib/validations/portfolio";
import type { Portfolio } from "@/types/portfolio";

export function createEmptyPortfolioInput(
  defaultClientId = "",
): PortfolioFormValues {
  return {
    title: "",
    clientId: defaultClientId,
    workType: "website",
    coverImage: "",
    description: "",
    url: "",
    featured: false,
  };
}

export function portfolioToFormInput(item: Portfolio): PortfolioFormValues {
  return {
    title: item.title,
    clientId: item.clientId,
    workType: item.workType,
    coverImage: item.coverImage,
    description: item.description,
    url: item.url,
    featured: item.featured,
  };
}
