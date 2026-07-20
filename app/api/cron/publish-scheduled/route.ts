import { verifyCronSecret, isCronSecretConfigured } from "@/lib/cron/verify-cron-secret";
import { promoteDueScheduledArticles } from "@/lib/db/articles";

async function handlePublishScheduled(request: Request) {
  if (!isCronSecretConfigured()) {
    return Response.json(
      { ok: false, error: "CRON_SECRET is not configured on the server." },
      { status: 503 },
    );
  }

  if (!verifyCronSecret(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const promoted = await promoteDueScheduledArticles();

    return Response.json({
      ok: true,
      promoted,
      ranAt: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to publish scheduled articles.",
      },
      { status: 500 },
    );
  }
}

/** cron-job.org — poll due scheduled articles and publish them. */
export async function GET(request: Request) {
  return handlePublishScheduled(request);
}

export async function POST(request: Request) {
  return handlePublishScheduled(request);
}
