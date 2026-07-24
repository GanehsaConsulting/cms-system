import type { Client } from "@/types/client";

export type ClientListPreviewMode = "auto" | "logo" | "photo";

export function getClientPhotoUrls(client: Client): string[] {
  return client.photos
    .map((photo) => photo.url.trim())
    .filter((url) => url.length > 0);
}

export interface ClientListPreview {
  url: string;
  fit: "contain" | "cover";
  previewImages: string[];
  previewTitle: string;
}

export function getClientListPreview(
  client: Client,
  mode: ClientListPreviewMode,
): ClientListPreview {
  const logoUrl = client.logo.trim();
  const photoUrls = getClientPhotoUrls(client);

  if (mode === "logo") {
    return {
      url: logoUrl,
      fit: "contain",
      previewImages: logoUrl ? [logoUrl] : [],
      previewTitle: client.name,
    };
  }

  if (mode === "photo") {
    return {
      url: photoUrls[0] ?? "",
      fit: "cover",
      previewImages: photoUrls,
      previewTitle: client.name,
    };
  }

  if (logoUrl) {
    return {
      url: logoUrl,
      fit: "contain",
      previewImages: [logoUrl],
      previewTitle: client.name,
    };
  }

  return {
    url: photoUrls[0] ?? "",
    fit: "cover",
    previewImages: photoUrls,
    previewTitle: client.name,
  };
}
