/** Lightweight CMS presence — session-based, no WebSockets. */

/** Consider online if session was touched within this window. */
export const PRESENCE_ONLINE_THRESHOLD_MS = 5 * 60 * 1000;

/**
 * How often the sidebar refreshes the online count.
 * Keep this relatively slow — each tick opens a short-lived DB round-trip.
 */
export const PRESENCE_POLL_INTERVAL_MS = 60 * 1000;

/** Recent sign-ins shown in the presence dialog. */
export const PRESENCE_LOGIN_HISTORY_LIMIT = 30;
