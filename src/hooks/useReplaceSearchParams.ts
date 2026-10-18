"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useReplaceSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  return useCallback(
    (next: URLSearchParams, replace = true) => {
      const query = next.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      if (replace) router.replace(url);
      else router.push(url);
    },
    [pathname, router],
  );
}