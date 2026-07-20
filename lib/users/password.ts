/** Alphabet without ambiguous characters (0/O, 1/l/I). */
const PASSWORD_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

export const USER_PASSWORD_LIMITS = {
  min: 8,
  max: 128,
  generatedLength: 12,
} as const;

/** Cryptographically random password — safe in browser and Node. */
export function generateUserPassword(
  length = USER_PASSWORD_LIMITS.generatedLength,
): string {
  const size = Math.min(
    USER_PASSWORD_LIMITS.max,
    Math.max(USER_PASSWORD_LIMITS.min, length),
  );
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return Array.from(
    bytes,
    (byte) => PASSWORD_ALPHABET[byte % PASSWORD_ALPHABET.length]!,
  ).join("");
}
