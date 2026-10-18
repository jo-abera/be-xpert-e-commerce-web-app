'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { useCreateCategory } from '@/hooks/useCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/lib/api/client';

export function AdminCategoryNew() {
  useDocumentTitle('New category');
  const router = useRouter();
  const create = useCreateCategory();

  return (
    <div>
      <PageHeader
        title="New category"
        description="Creates a real record on the shared EscuelaJS API. Use test data."
        back={{ to: '/admin/categories', label: 'All categories' }} />
      
      <CategoryForm
        submitLabel="Create category"
        isSubmitting={create.isPending}
        error={create.isError ? getErrorMessage(create.error) : null}
        onCancel={() => router.push('/admin/categories')}
        onSubmit={(input) =>
        create.mutate(input, {
          onSuccess: (category) => {
            toast.success('Category created', { description: category.name });
            router.push('/admin/categories');
          }
        })
        } />
      
    </div>);

}