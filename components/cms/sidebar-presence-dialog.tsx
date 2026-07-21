"use client";

import { SidebarPresenceUserRow } from "@/components/cms/sidebar-presence-user-row";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import type { CmsPresenceUser } from "@/types/presence";

interface SidebarPresenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: CmsPresenceUser[];
  onlineCount: number;
  isLoading: boolean;
}

export function SidebarPresenceDialog({
  open,
  onOpenChange,
  users,
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
        <CmsDialogBody className="max-h-[min(70vh,24rem)] space-y-0.5 py-3">
          {isLoading && users.length === 0 ? (
            <p className="px-1 py-6 text-center text-muted-foreground text-sm">
              Loading…
            </p>
          ) : users.length === 0 ? (
            <p className="px-1 py-6 text-center text-muted-foreground text-sm">
              No active users found.
            </p>
          ) : (
            users.map((user) => (
              <SidebarPresenceUserRow key={user.id} user={user} />
            ))
          )}
        </CmsDialogBody>
      </CmsDialogContent>
    </CmsDialog>
  );
}
