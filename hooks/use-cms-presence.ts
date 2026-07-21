"use client";

import { useCallback, useEffect, useState } from "react";
import { PRESENCE_POLL_INTERVAL_MS } from "@/config/presence";
import { getCmsPresenceAction } from "@/lib/actions/presence";
import type { CmsPresenceSnapshot } from "@/types/presence";

const EMPTY_SNAPSHOT: CmsPresenceSnapshot = {
  onlineCount: 0,
  users: [],
  fetchedAt: "",
};

export function useCmsPresence() {
  const [snapshot, setSnapshot] = useState<CmsPresenceSnapshot>(EMPTY_SNAPSHOT);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await getCmsPresenceAction();
    if (result.success) {
      setSnapshot(result.data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function tick() {
      if (cancelled || document.visibilityState === "hidden") {
        return;
      }
      await refresh();
    }

    void tick();
    timer = setInterval(() => {
      void tick();
    }, PRESENCE_POLL_INTERVAL_MS);

    function onVisible() {
      if (document.visibilityState === "visible") {
        void tick();
      }
    }

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      if (timer) {
        clearInterval(timer);
      }
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return {
    onlineCount: snapshot.onlineCount,
    users: snapshot.users,
    isLoading,
    refresh,
  };
}
