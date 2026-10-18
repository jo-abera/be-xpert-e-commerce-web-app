import { Suspense } from "react";

import { ProductsClient } from "@/components/products/ProductsClient";
import { PageLoader } from "@/components/ui/PageLoader";

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading…" />}>
      <ProductsClient />
    </Suspense>
  );
}
