'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangleIcon, PackageXIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProductForm } from "@/components/admin/ProductForm";
import { StateMessage } from '@/components/ui/StateMessage';
import { PageLoader } from '@/components/ui/PageLoader';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage, isNotFoundError } from '@/lib/api/client';

export function AdminProductEdit({ productId: id }: { productId: string }) {
  useDocumentTitle('Edit product');
  const productId = Number(id);
  const router = useRouter();
  const { data: product, isLoading, isError, error, refetch } = useProduct(productId);
  const update = useUpdateProduct(productId);
  const detailPath = `/admin/products/${productId}`;

  if (!Number.isInteger(productId) || productId <= 0 || isError && isNotFoundError(error)) {
    return <StateMessage icon={PackageXIcon} title="Product not found" action={<Link href="/admin/products" className={buttonVariants('primary')}>Back to products</Link>} />;
  }
  if (isLoading) return <PageLoader label="Loading product…" />;
  if (isError || !product) {
    return <StateMessage tone="error" icon={AlertTriangleIcon} title="We couldn't load this product" description={getErrorMessage(error)} action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>} />;
  }
  return (
    <div>
      <PageHeader title={`Edit “${product.title}”`} back={{ to: detailPath, label: 'Product details' }} />
      <ProductForm
        initial={product}
        submitLabel="Save changes"
        isSubmitting={update.isPending}
        error={update.isError ? getErrorMessage(update.error) : null}
        onCancel={() => router.push(detailPath)}
        onSubmit={(input) =>
        update.mutate(input, {
          onSuccess: () => {
            toast.success('Product updated');
            router.push(detailPath);
          }
        })
        } />
      
    </div>);

}