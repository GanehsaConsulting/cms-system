"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { toast } from "sonner";
import { CMS_NAME } from "@/config/nav";

/** Mandatory: every CMS mutation must surface success or failure feedback. */

export function notifySuccess(message: string) {
  toast.success(CMS_NAME, { description: message });
}

export function notifyError(message: string) {
  toast.error(CMS_NAME, { description: message });
}

type FailedActionResult = { success: false; error: string };
type ActionResultLike =
  | FailedActionResult
  | { success: true; [key: string]: unknown }
  | void
  | undefined
  | null;

function isFailedResult(result: ActionResultLike): result is FailedActionResult {
  return (
    Boolean(result) &&
    typeof result === "object" &&
    "success" in result &&
    result.success === false
  );
}

/**
 * Notify from a typical Server Action result.
 * Returns `false` when the action failed (after showing an error toast).
 */
export function notifyFromActionResult(
  result: ActionResultLike,
  successMessage: string,
  errorFallback = "Something went wrong.",
): boolean {
  if (isFailedResult(result)) {
    notifyError(result.error || errorFallback);
    return false;
  }

  notifySuccess(successMessage);
  return true;
}

/**
 * Run a Server Action and always toast success or error.
 * Re-throws Next.js redirect errors after a success toast so navigation still works.
 */
export async function runNotifiedAction<T>(
  action: () => Promise<T>,
  messages: { success: string; errorFallback?: string },
): Promise<{ ok: true; data: T } | { ok: false }> {
  try {
    const data = await action();

    if (isFailedResult(data as ActionResultLike)) {
      notifyError(
        (data as FailedActionResult).error ||
          messages.errorFallback ||
          "Something went wrong.",
      );
      return { ok: false };
    }

    notifySuccess(messages.success);
    return { ok: true, data };
  } catch (error) {
    if (isRedirectError(error)) {
      notifySuccess(messages.success);
      throw error;
    }

    notifyError(
      error instanceof Error
        ? error.message
        : messages.errorFallback || "Something went wrong.",
    );
    return { ok: false };
  }
}
