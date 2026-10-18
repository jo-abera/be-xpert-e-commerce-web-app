import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { PageLoader } from "@/components/ui/PageLoader";

export default function RegisterPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading…" />}>
      <RegisterForm />
    </Suspense>
  );
}
