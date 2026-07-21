/** Relative last-seen copy for the presence dialog (en-US). */
export function formatPresenceLastSeen(
  lastSeenAt: string | null,
  online: boolean,
  now: Date = new Date(),
): string {
  if (online) {
    return "Online now";
  }

  if (!lastSeenAt) {
    return "Never signed in";
  }

  const seen = new Date(lastSeenAt).getTime();
  if (Number.isNaN(seen)) {
    return "Unknown";
  }

  const deltaMs = Math.max(0, now.getTime() - seen);
  const minutes = Math.floor(deltaMs / 60_000);

  if (minutes < 1) {
    return "Just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(lastSeenAt));
}
