import { timingSafeEqual } from "node:crypto";

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization")?.trim();

  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = authorization.slice(7).trim();
  return token.length > 0 ? token : null;
}

function readQueryPreview(request: Request): string | null {
  const preview = new URL(request.url).searchParams.get("preview")?.trim();
  return preview && preview.length > 0 ? preview : null;
}

function secretsMatch(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

/** Validates draft/scheduled preview for public article detail. */
export function verifyPreviewSecret(request: Request): boolean {
  const expected = process.env.CMS_PREVIEW_SECRET?.trim();

  if (!expected) {
    return false;
  }

  const provided = readBearerToken(request) ?? readQueryPreview(request);

  if (!provided) {
    return false;
  }

  return secretsMatch(provided, expected);
}

export function isPreviewSecretConfigured(): boolean {
  return Boolean(process.env.CMS_PREVIEW_SECRET?.trim());
}
