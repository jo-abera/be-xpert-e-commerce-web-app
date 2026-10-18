'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProductForm } from "@/components/admin/ProductForm";
import { useCreateProduct } from '@/hooks/useProducts';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/lib/api/client';

export function AdminProductNew() {
  useDocumentTitle('New product');
  const router = useRouter();
  const create = useCreateProduct();

  return (
    <div>
      <PageHeader
        title="New product"
        description="Creates a real record on the shared EscuelaJS API. Use test data."
        back={{ to: '/admin/products', label: 'All products' }} />
      
      <ProductForm
        submitLabel="Create product"
        isSubmitting={create.isPending}
        error={create.isError ? getErrorMessage(create.error) : null}
        onCancel={() => router.push('/admin/products')}
        onSubmit={(input) =>
        create.mutate(input, {
          onSuccess: (product) => {
            toast.success('Product created', { description: product.title });
            router.push(`/admin/products/${product.id}`);
          }
        })
        } />
      
    </div>);

}