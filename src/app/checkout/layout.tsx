import { Suspense } from "react";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { PageLoader } from "@/components/ui/PageLoader";

const CHECKOUT_MESSAGE =
  "Please log in or create an account to continue to checkout.";

export default function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<PageLoader label="Loading…" />}>
      <AuthGuard message={CHECKOUT_MESSAGE}>{children}</AuthGuard>
    </Suspense>
  );
}
