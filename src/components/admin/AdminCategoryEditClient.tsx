'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangleIcon, ExternalLinkIcon, FolderXIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { StateMessage } from '@/components/ui/StateMessage';
import { PageLoader } from '@/components/ui/PageLoader';
import { ProductImage } from '@/components/ui/ProductImage';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useCategory, useUpdateCategory } from '@/hooks/useCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage, isNotFoundError } from '@/lib/api/client';
import { formatDate } from '@/utils/format';

export function AdminCategoryEdit({ categoryId: id }: { categoryId: string }) {
  const categoryId = Number(id);
  const router = useRouter();
  const { data: category, isLoading, isError, error, refetch } = useCategory(categoryId);
  const update = useUpdateCategory(categoryId);
  useDocumentTitle(category ? `Admin · ${category.name}` : 'Admin · Category');

  if (!Number.isInteger(categoryId) || categoryId <= 0 || isError && isNotFoundError(error)) {
    return <StateMessage icon={FolderXIcon} title="Category not found" action={<Link href="/admin/categories" className={buttonVariants('primary')}>Back to categories</Link>} />;
  }
  if (isLoading) return <PageLoader label="Loading category…" />;
  if (isError || !category) {
    return <StateMessage tone="error" icon={AlertTriangleIcon} title="We couldn't load this category" description={getErrorMessage(error)} action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>} />;
  }

  return (
    <div>
      <PageHeader
        title={category.name}
        back={{ to: '/admin/categories', label: 'All categories' }}
        actions={<Link href={`/categories/${category.slug}`} className={buttonVariants('ghost')}><ExternalLinkIcon aria-hidden="true" />View in store</Link>} />
      

      <div className="mb-10 flex flex-col gap-6 border-b border-border pb-10 sm:flex-row">
        <ProductImage src={category.image} alt={category.name} className="aspect-[4/3] w-full rounded-lg border border-border sm:w-56" />
        <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 text-sm">
          {[
          ['ID', `#${category.id}`],
          ['Slug', category.slug],
          ['Created', formatDate(category.creationAt)],
          ['Updated', formatDate(category.updatedAt)]].
          map(([label, value]) =>
          <div key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 break-words">{value}</dd>
            </div>
          )}
        </dl>
      </div>

      <h2 className="mb-5 text-lg font-semibold">Edit category</h2>
      <CategoryForm
        initial={category}
        submitLabel="Save changes"
        isSubmitting={update.isPending}
        error={update.isError ? getErrorMessage(update.error) : null}
        onCancel={() => router.push('/admin/categories')}
        onSubmit={(input) =>
          update.mutate(input, { onSuccess: () => toast.success('Category updated') })
        }
      />
    </div>);

}