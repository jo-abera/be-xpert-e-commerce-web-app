"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { PageLoader } from "@/components/ui/PageLoader";
import { useAuthStore } from "@/store/auth-store";
import { buildLoginHref } from "@/utils/auth-redirect";

/**
 * Client-side guard. It improves UX but is not a security boundary —
 * real protection must be enforced by the API/backend.
 */
export function AuthGuard({
  children,
  message,
}: {
  children: React.ReactNode;
  message: string;
}) {
  const token = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (token) return;
    const from =
      pathname +
      (searchParams.toString() ? `?${searchParams.toString()}` : "");
    router.replace(buildLoginHref({ from, message }));
  }, [token, router, pathname, searchParams.toString(), message]);

  if (!token) {
    return <PageLoader label="Redirecting to login…" />;
  }

  return children;
}
