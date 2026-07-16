import { v2 as cloudinary } from "cloudinary";
import { getEnv } from "@/lib/env";

let configured = false;

function ensureCloudinaryConfigured() {
  if (configured) {
    return;
  }

  const env = getEnv();

  if (env.CLOUDINARY_URL) {
    // Reads CLOUDINARY_URL from process.env
    cloudinary.config(true);
  } else if (
    env.CLOUDINARY_CLOUD_NAME &&
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  } else {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_URL or CLOUDINARY_* vars.",
    );
  }

  configured = true;
}

export function getCloudinary() {
  ensureCloudinaryConfigured();
  return cloudinary;
}

export async function uploadImageBuffer(
  buffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
  } = {},
) {
  const client = getCloudinary();

  return new Promise<{
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
  }>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: options.folder ?? "cms-system",
        public_id: options.publicId,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    stream.end(buffer);
  });
}
