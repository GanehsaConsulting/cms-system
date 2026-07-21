import { z } from "zod";
import { MEDIA_LIBRARY_MAX_UPLOAD_BATCH } from "@/config/media-library";

const mediaKindSchema = z.enum(["image", "video", "document", "other"]);

export const mediaUploadMetaSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(255),
  sizeBytes: z.number().int().nonnegative(),
  kind: mediaKindSchema,
});

export const mediaUploadMetaBatchSchema = z
  .array(mediaUploadMetaSchema)
  .min(1, "No files selected")
  .max(MEDIA_LIBRARY_MAX_UPLOAD_BATCH);

export const mediaCloudinaryUploadResultSchema = mediaUploadMetaSchema.extend({
  url: z.string().url(),
  publicId: z.string().trim().min(1),
});

export const mediaCloudinaryUploadBatchSchema = z
  .array(mediaCloudinaryUploadResultSchema)
  .min(1, "No files to save")
  .max(MEDIA_LIBRARY_MAX_UPLOAD_BATCH);
