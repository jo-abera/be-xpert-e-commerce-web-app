"use client";

import { usePathname } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";

/** Wraps storefront routes with header/footer; admin routes use their own shell. */
export function AppShellGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return children;
  }
  return <AppShell>{children}</AppShell>;
}
