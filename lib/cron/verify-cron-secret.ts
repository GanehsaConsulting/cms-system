import { timingSafeEqual } from "node:crypto";

function readBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization")?.trim();

  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = authorization.slice(7).trim();
  return token.length > 0 ? token : null;
}

function readQuerySecret(request: Request): string | null {
  const secret = new URL(request.url).searchParams.get("secret")?.trim();
  return secret && secret.length > 0 ? secret : null;
}

function secretsMatch(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

/** Validates cron-job.org (or any caller) using CRON_SECRET. */
export function verifyCronSecret(request: Request): boolean {
  const expected = process.env.CRON_SECRET?.trim();

  if (!expected) {
    return false;
  }

  const provided = readBearerToken(request) ?? readQuerySecret(request);

  if (!provided) {
    return false;
  }

  return secretsMatch(provided, expected);
}

export function isCronSecretConfigured(): boolean {
  return Boolean(process.env.CRON_SECRET?.trim());
}
