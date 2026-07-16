import { getCloudinary, uploadImageBuffer } from "@/lib/cloudinary/client";

const DATA_URL_RE = /^data:([^;]+);base64,(.+)$/i;

function parseDataUrl(value: string): { mime: string; buffer: Buffer } | null {
  const match = DATA_URL_RE.exec(value.trim());
  if (!match) {
    return null;
  }

  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

/** Upload a data URL to Cloudinary; pass through http(s) URLs unchanged. */
export async function resolveImageAsset(
  value: string,
  folder: string,
  resourceType: "image" | "video" | "raw" | "auto" = "image",
): Promise<string> {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const parsed = parseDataUrl(trimmed);
  if (!parsed) {
    return trimmed;
  }

  const uploaded = await uploadImageBuffer(parsed.buffer, {
    folder,
    resourceType,
  });
  return uploaded.secure_url;
}

export async function resolveImageAssets(
  values: string[],
  folder: string,
): Promise<string[]> {
  const resolved: string[] = [];

  for (const value of values) {
    const url = await resolveImageAsset(value, folder);
    if (url) {
      resolved.push(url);
    }
  }

  return resolved;
}

/** Best-effort delete when URL is a Cloudinary asset for this cloud. */
export async function tryDeleteCloudinaryUrl(url: string): Promise<void> {
  if (!url.includes("res.cloudinary.com")) {
    return;
  }

  try {
    const client = getCloudinary();
    const match = /\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i.exec(url);
    if (!match?.[1]) {
      return;
    }

    await client.uploader.destroy(match[1]);
  } catch {
    // Non-fatal — orphaned assets can be cleaned later in Cloudinary.
  }
}
