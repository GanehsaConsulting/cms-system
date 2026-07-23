"use client";

import { SidebarPresenceLoginRow } from "@/components/cms/sidebar-presence-login-row";
import { SidebarPresenceUserRow } from "@/components/cms/sidebar-presence-user-row";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import type {
  CmsLoginHistoryEntry,
  CmsPresenceUser,
} from "@/types/presence";

interface SidebarPresenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: CmsPresenceUser[];
  loginHistory: CmsLoginHistoryEntry[];
  onlineCount: number;
  isLoading: boolean;
}

export function SidebarPresenceDialog({
  open,
  onOpenChange,
  users,
  loginHistory,
  onlineCount,
  isLoading,
}: SidebarPresenceDialogProps) {
  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent size="sm" className="gap-0 overflow-hidden p-0">
        <CmsDialogHeader className="border-(--separator) border-b px-5 py-4">
          <CmsDialogTitle>Team presence</CmsDialogTitle>
          <CmsDialogDescription>
            {onlineCount} online · Based on recent CMS activity
          </CmsDialogDescription>
        </CmsDialogHeader>
        <CmsDialogBody className="max-h-[min(70vh,28rem)] space-y-5 py-3">
          <section className="space-y-1">
            <p className="px-1 pb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Online now
            </p>
            {isLoading && users.length === 0 ? (
              <p className="px-1 py-4 text-center text-muted-foreground text-sm">
                Loading…
              </p>
            ) : users.length === 0 ? (
              <p className="px-1 py-4 text-center text-muted-foreground text-sm">
                No active users found.
              </p>
            ) : (
              users.map((user) => (
                <SidebarPresenceUserRow key={user.id} user={user} />
              ))
            )}
          </section>

          <section className="space-y-1 border-(--separator) border-t pt-4">
            <p className="px-1 pb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Login history
            </p>
            {isLoading && loginHistory.length === 0 ? (
              <p className="px-1 py-4 text-center text-muted-foreground text-sm">
                Loading…
              </p>
            ) : loginHistory.length === 0 ? (
              <p className="px-1 py-4 text-center text-muted-foreground text-sm">
                No recent logins yet.
              </p>
            ) : (
              loginHistory.map((entry) => (
                <SidebarPresenceLoginRow
                  key={entry.sessionId}
                  entry={entry}
                />
              ))
            )}
          </section>
        </CmsDialogBody>
      </CmsDialogContent>
    </CmsDialog>
  );
}
