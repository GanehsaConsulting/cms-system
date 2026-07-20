import { CMS_PUBLIC_ORIGIN } from "@/config/public-api";

export const CRON_PUBLISH_SCHEDULED_PATH = "/api/cron/publish-scheduled";

/** Build the URL to paste into cron-job.org (include your real secret). */
export function buildCronPublishScheduledUrl(
  secret: string,
  origin = CMS_PUBLIC_ORIGIN,
): string {
  const base = origin.replace(/\/$/, "");
  return `${base}${CRON_PUBLISH_SCHEDULED_PATH}?secret=${encodeURIComponent(secret)}`;
}

export const CRON_JOB_ORG_PUBLISH_SCHEDULED_MARKDOWN = `# Scheduled articles — cron-job.org

Promote due \`scheduled\` articles to \`published\` on a fixed interval (no site traffic required).

## 1. Server env

Set on production (Vercel/hosting):

\`\`\`env
CRON_SECRET=your-long-random-secret
\`\`\`

Generate: \`openssl rand -base64 32\`

## 2. cron-job.org job

| Field | Value |
|-------|--------|
| Title | CMS — publish scheduled articles |
| URL | \`${CMS_PUBLIC_ORIGIN}${CRON_PUBLISH_SCHEDULED_PATH}?secret=YOUR_CRON_SECRET\` |
| Schedule | Every **1 minute** (or every 5 minutes) |
| Request method | GET |
| Enabled | Yes |

Replace \`YOUR_CRON_SECRET\` with the same value as \`CRON_SECRET\` on the server.

Optional header instead of query string:

\`\`\`
Authorization: Bearer YOUR_CRON_SECRET
\`\`\`

## 3. Success response

\`\`\`json
{ "ok": true, "promoted": 2, "ranAt": "2026-07-20T07:00:00.000Z" }
\`\`\`

\`promoted\` is how many articles flipped to \`published\` on that run.

## 4. Notes

- Articles still auto-promote on CMS/public API reads as a fallback.
- Public FE only consumes \`published\` articles — no FE changes needed.
- Keep the secret private; rotate if leaked.
`;
