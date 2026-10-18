'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangleIcon, FolderXIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProductGrid } from '@/components/products/ProductGrid';
import { StateMessage } from '@/components/ui/StateMessage';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useCategoryBySlug, useCategoryProducts } from '@/hooks/useCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage, isNotFoundError } from '@/lib/api/client';
import { filterStorefrontProducts } from '@/utils/product-display';

export function CategoryProductsClient({ slug }: { slug: string }) {
  const category = useCategoryBySlug(slug);
  const products = useCategoryProducts(category.data?.id);
  useDocumentTitle(category.data?.name ?? 'Category');

  if (category.isError && isNotFoundError(category.error)) {
    return (
      <StateMessage
        icon={FolderXIcon}
        title="Category not found"
        description="This category doesn't exist or has been renamed."
        action={<Link href="/categories" className={buttonVariants('primary')}>All categories</Link>}
        className="mt-8" />);


  }

  if (category.isError) {
    return (
      <StateMessage
        tone="error"
        icon={AlertTriangleIcon}
        title="We couldn't load this category"
        description={getErrorMessage(category.error)}
        action={<Button variant="outline" onClick={() => category.refetch()}>Try again</Button>}
        className="mt-8" />);


  }

  return (
    <div>
      {category.isLoading ?
      <div className="mb-8 space-y-3" role="status" aria-label="Loading category">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-56" />
        </div> :

      <PageHeader
        title={category.data?.name ?? 'Category'}
        description={
          products.data
            ? `${filterStorefrontProducts(products.data).length} products`
            : undefined
        }
        back={{ to: '/categories', label: 'All categories' }} />

      }
      <ProductGrid
        products={filterStorefrontProducts(products.data ?? [])}
        isLoading={category.isLoading || products.isLoading}
        isError={products.isError}
        error={products.error}
        onRetry={() => products.refetch()}
        emptyTitle="This category is empty"
        emptyDescription="There are no products here yet. Browse the full catalog instead."
        emptyAction={<Link href="/products" className={buttonVariants('outline')}>Browse all products</Link>} />
      
    </div>);

}