export interface CmsPresenceUser {
  id: string;
  name: string;
  email: string;
  roleLabel: string;
  avatarUrl: string;
  online: boolean;
  /** ISO timestamp of last session activity, or null if never. */
  lastSeenAt: string | null;
}

/** One CMS sign-in (session created). */
export interface CmsLoginHistoryEntry {
  sessionId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  roleLabel: string;
  loggedInAt: string;
  ipAddress: string | null;
}

export interface CmsPresenceSnapshot {
  onlineCount: number;
  users: CmsPresenceUser[];
  loginHistory: CmsLoginHistoryEntry[];
  fetchedAt: string;
}
