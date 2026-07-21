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

export interface CmsPresenceSnapshot {
  onlineCount: number;
  users: CmsPresenceUser[];
  fetchedAt: string;
}
