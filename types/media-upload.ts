import type { MediaKind } from "@/types/media";

export interface MediaUploadMeta {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  kind: MediaKind;
}

export interface MediaCloudinaryUploadResult extends MediaUploadMeta {
  url: string;
  publicId: string;
}

/** Public signed params returned to the browser (no API secret). */
export interface CloudinarySignedUploadParams {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
  /** Upload endpoint resource type — not part of the signed payload. */
  resourceType: "auto";
}
