/** Lightweight CMS presence — session-based, no WebSockets. */

/** Consider online if session was touched within this window. */
export const PRESENCE_ONLINE_THRESHOLD_MS = 3 * 60 * 1000;

/** How often the sidebar refreshes the online count. */
export const PRESENCE_POLL_INTERVAL_MS = 45 * 1000;
