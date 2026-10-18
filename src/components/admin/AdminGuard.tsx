"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertTriangleIcon } from "lucide-react";

import { AdminAccessGate } from "@/components/admin/AdminAccessGate";
import { PageLoader } from "@/components/ui/PageLoader";
import { StateMessage } from "@/components/ui/StateMessage";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/auth-store";
import { useAdminStore } from "@/store/admin-store";
import { useProfile } from "@/hooks/useAuth";
import { buildLoginHref } from "@/utils/auth-redirect";
import { getErrorMessage } from "@/lib/api/client";

/**
 * Requires login, then either an `admin` role reported by the API or the
 * development-only access flag. Neither is a substitute for server-side authorization.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.accessToken);
  const devAccess = useAdminStore((s) => s.devAccess);
  const { data: profile, isLoading, isError, error, refetch } = useProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!token) {
      router.replace(
        buildLoginHref({
          from: pathname,
          message: "Log in to access the admin dashboard.",
        }),
      );
    }
  }, [token, router, pathname]);

  if (!token) {
    return <PageLoader label="Redirecting to login…" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageLoader label="Checking access…" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <StateMessage
          tone="error"
          icon={AlertTriangleIcon}
          title="We couldn't verify your account"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
          className="w-full max-w-lg"
        />
      </div>
    );
  }

  if (profile.role !== "admin" && !devAccess) {
    return <AdminAccessGate profile={profile} />;
  }

  return children;
}
