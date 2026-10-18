import { Suspense } from "react";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { PageLoader } from "@/components/ui/PageLoader";

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<PageLoader label="Loading…" />}>
      <AuthGuard message="Please log in to view your profile.">
        {children}
      </AuthGuard>
    </Suspense>
  );
}
