/**
 * Browser → Cloudinary signed upload.
 * Safe for client imports (no secrets — uses params from the server action).
 * Image files are optimized first when Appearance → Optimize is ON.
 */

import { prepareCmsImageFileForUpload } from "@/lib/articles/prepare-image-data-url";
import type { CloudinarySignedUploadParams } from "@/types/media-upload";

interface CloudinaryUploadApiResponse {
  secure_url?: string;
  public_id?: string;
  bytes?: number;
  error?: { message?: string };
}

export async function uploadFileToCloudinary(
  file: File,
  params: CloudinarySignedUploadParams,
): Promise<{
  url: string;
  publicId: string;
  sizeBytes: number;
  filename: string;
  mimeType: string;
}> {
  const uploadFile = await prepareCmsImageFileForUpload(file);
  const endpoint = `https://api.cloudinary.com/v1_1/${params.cloudName}/${params.resourceType}/upload`;
  const body = new FormData();
  body.append("file", uploadFile);
  body.append("api_key", params.apiKey);
  body.append("timestamp", String(params.timestamp));
  body.append("signature", params.signature);
  body.append("folder", params.folder);

  const response = await fetch(endpoint, {
    method: "POST",
    body,
  });

  const payload = (await response.json()) as CloudinaryUploadApiResponse;

  if (!response.ok || !payload.secure_url || !payload.public_id) {
    throw new Error(
      payload.error?.message ?? "Failed to upload file to Cloudinary",
    );
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id,
    sizeBytes: payload.bytes ?? uploadFile.size,
    filename: uploadFile.name,
    mimeType: uploadFile.type || "application/octet-stream",
  };
}
