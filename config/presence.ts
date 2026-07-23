/** Lightweight CMS presence — session-based, no WebSockets. */

/** Consider online if session was touched within this window. */
export const PRESENCE_ONLINE_THRESHOLD_MS = 3 * 60 * 1000;

/**
 * How often the sidebar refreshes the online count.
 * Keep this relatively slow — each tick opens a short-lived DB round-trip.
 */
export const PRESENCE_POLL_INTERVAL_MS = 90 * 1000;
