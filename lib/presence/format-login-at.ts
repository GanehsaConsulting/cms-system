/** Absolute login timestamp for presence history (en-US). */
export function formatPresenceLoginAt(
  loggedInAt: string,
  now: Date = new Date(),
): string {
  const at = new Date(loggedInAt).getTime();
  if (Number.isNaN(at)) {
    return "Unknown";
  }

  const deltaMs = Math.max(0, now.getTime() - at);
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

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(loggedInAt));
}
