import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { PageLoader } from "@/components/ui/PageLoader";

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading…" />}>
      <LoginForm />
    </Suspense>
  );
}
