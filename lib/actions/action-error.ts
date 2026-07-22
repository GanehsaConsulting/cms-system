import { isRedirectError } from "next/dist/client/components/redirect-error";

/**
 * Convert unknown catch values into a failed action result.
 * Re-throws Next.js redirect/not-found control-flow errors so navigation still works.
 */
export function toActionError(
  error: unknown,
  fallback: string,
): { success: false; error: string } {
  if (isRedirectError(error)) {
    throw error;
  }

  return {
    success: false as const,
    error: error instanceof Error ? error.message : fallback,
  };
}
