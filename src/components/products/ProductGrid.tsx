import React from 'react';
import { AlertTriangleIcon, PackageSearchIcon } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/Skeleton';
import { StateMessage } from '../ui/StateMessage';
import { Button } from '../ui/Button';
import { getErrorMessage } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

interface ProductGridProps {
  products?: Product[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  skeletonCount?: number;
  className?: string;
}

const gridClass = 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4';

export function ProductGrid({
  products,
  isLoading,
  isError,
  error,
  onRetry,
  emptyTitle = 'No products found',
  emptyDescription,
  emptyAction,
  skeletonCount = 8,
  className
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn(gridClass, className)} role="status" aria-label="Loading products">
        {Array.from({ length: skeletonCount }).map((_, i) =>
        <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex items-center justify-between pt-3">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </div>
        )}
      </div>);

  }

  if (isError) {
    return (
      <StateMessage
        tone="error"
        icon={AlertTriangleIcon}
        title="We couldn't load products"
        description={getErrorMessage(error)}
        action={onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>}
        className={cn('bg-card', className)} />);


  }

  if (!products || products.length === 0) {
    return (
      <StateMessage
        icon={PackageSearchIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        className={cn('bg-card', className)} />);


  }

  return (
    <div className={cn(gridClass, className)}>
      {products.map((product) =>
      <ProductCard key={product.id} product={product} />
      )}
    </div>);

}