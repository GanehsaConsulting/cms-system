import { getCloudinary } from "@/lib/cloudinary/client";
import type { CloudinarySignedUploadParams } from "@/types/media-upload";

function getCloudinaryPublicConfig(): { cloudName: string; apiKey: string } {
  const config = getCloudinary().config();
  const cloudName = config.cloud_name;
  const apiKey = config.api_key;

  if (!cloudName || !apiKey) {
    throw new Error("Cloudinary cloud name / API key is not configured.");
  }

  return { cloudName, apiKey };
}

/** Signed params for browser → Cloudinary upload (folder scoped per media folder). */
export function createSignedMediaUploadParams(
  folderId: string,
): CloudinarySignedUploadParams {
  const client = getCloudinary();
  const { cloudName, apiKey } = getCloudinaryPublicConfig();
  const apiSecret = client.config().api_secret;
  if (!apiSecret) {
    throw new Error("Cloudinary API secret is not configured.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `cms-system/media/${folderId}`;
  const signature = client.utils.api_sign_request(
    { timestamp, folder },
    apiSecret,
  );

  return {
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    resourceType: "auto",
  };
}
