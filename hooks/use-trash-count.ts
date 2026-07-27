"use client";

import { useEffect, useState } from "react";

export function useTrashCount(brandId: string | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!brandId) {
        setCount(0);
        return;
      }

      try {
        const response = await fetch(
          `/api/cms/trash-count?brandId=${encodeURIComponent(brandId)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          if (!cancelled) {
            setCount(0);
          }
          return;
        }

        const data = (await response.json()) as { count?: number };
        if (!cancelled) {
          setCount(Math.max(0, Number(data.count ?? 0)));
        }
      } catch {
        if (!cancelled) {
          setCount(0);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [brandId]);

  return count;
}
