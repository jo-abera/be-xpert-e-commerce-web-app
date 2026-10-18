'use client';

import React from 'react';
import { AlertTriangleIcon, FolderOpenIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { StateMessage } from '@/components/ui/StateMessage';
import { Button } from '@/components/ui/Button';
import { useCategories } from '@/hooks/useCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/lib/api/client';

export function CategoriesClient() {
  useDocumentTitle('Categories');
  const { data, isLoading, isError, error, refetch } = useCategories();

  return (
    <div>
      <PageHeader title="Categories" description="Pick a category to see everything in it." />
      {isLoading ?
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4" role="status" aria-label="Loading categories">
          {Array.from({ length: 8 }).map((_, i) =>
        <div key={i}>
              <Skeleton className="aspect-[4/3] w-full rounded-lg" />
              <Skeleton className="mt-2.5 h-4 w-1/2" />
            </div>
        )}
        </div> :
      isError ?
      <StateMessage
        tone="error"
        icon={AlertTriangleIcon}
        title="We couldn't load categories"
        description={getErrorMessage(error)}
        action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>} /> :

      !data || data.length === 0 ?
      <StateMessage icon={FolderOpenIcon} title="No categories yet" description="Categories will appear here once added." /> :

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((category) =>
        <CategoryCard key={category.id} category={category} />
        )}
        </div>
      }
    </div>);

}