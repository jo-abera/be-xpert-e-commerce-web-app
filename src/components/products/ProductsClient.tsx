'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReplaceSearchParams } from '@/hooks/useReplaceSearchParams';
import { SlidersHorizontalIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFiltersPanel, type FilterKey } from '@/components/products/ProductFiltersPanel';
import { Button } from '@/components/ui/Button';
import { inputClasses } from '@/components/ui/Input';
import { useProducts } from '@/hooks/useProducts';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { sortOptions, sortProducts } from '@/utils/products';
import { cn } from '@/lib/utils';
import type { ProductFilters, ProductSort } from '@/types/product';
import { filterStorefrontProducts } from '@/utils/product-display';

const PAGE_SIZE = 24;

function toNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function ProductsClient() {
  useDocumentTitle('Products');
  const params = useSearchParams();
  const setParams = useReplaceSearchParams();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const min = params.get('min') ?? '';
  const max = params.get('max') ?? '';
  const sortParam = params.get('sort') as ProductSort | null;
  const sort: ProductSort = sortOptions.some((o) => o.value === sortParam) ? sortParam as ProductSort : 'newest';

  const debouncedQ = useDebouncedValue(q.trim(), 350);
  const debouncedMin = toNumber(useDebouncedValue(min, 400));
  const debouncedMax = toNumber(useDebouncedValue(max, 400));

  const priceError =
  (debouncedMin ?? 0) < 0 || (debouncedMax ?? 0) < 0 ?
  'Prices cannot be negative.' :
  debouncedMin !== undefined && debouncedMax !== undefined && debouncedMin > debouncedMax ?
  'Minimum price must be lower than maximum.' :
  undefined;

  const filters: ProductFilters = useMemo(
    () => ({
      title: debouncedQ || undefined,
      categoryId: category ? Number(category) : undefined,
      ...(priceError ? {} : { priceMin: debouncedMin, priceMax: debouncedMax })
    }),
    [debouncedQ, category, debouncedMin, debouncedMax, priceError]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useProducts(filters);
  const sorted = useMemo(
    () => (data ? sortProducts(filterStorefrontProducts(data), sort) : undefined),
    [data, sort],
  );
  const hasFilters = Boolean(q || category || min || max);

  const update = (key: FilterKey | 'sort', value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);else
    next.delete(key);
    setParams(next, true);
    setVisible(PAGE_SIZE);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (sortParam) next.set('sort', sort);
    setParams(next, true);
    setVisible(PAGE_SIZE);
  };

  return (
    <div>
      <PageHeader title="Products" description="Search and filter the full catalog." />

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="min-w-0">
          <Button
            variant="outline"
            className="w-full lg:hidden"
            aria-expanded={filtersOpen}
            aria-controls="filters-panel"
            onClick={() => setFiltersOpen((o) => !o)}>
            
            <SlidersHorizontalIcon aria-hidden="true" />
            {filtersOpen ? 'Hide filters' : 'Show filters'}
          </Button>
          <div
            id="filters-panel"
            className={cn(
              'mt-4 rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-32 lg:mt-0 lg:block',
              filtersOpen ? 'block' : 'hidden'
            )}>
            
            <ProductFiltersPanel
              q={q}
              category={category}
              min={min}
              max={max}
              priceError={priceError}
              hasFilters={hasFilters}
              onChange={update}
              onClear={clearFilters} />
            
          </div>
        </aside>

        <section aria-label="Results" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {isLoading ? 'Loading products…' : sorted ? `${sorted.length} ${sorted.length === 1 ? 'product' : 'products'}` : ''}
              {isFetching && !isLoading && <span className="ml-2">· Updating…</span>}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-muted-foreground">
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => update('sort', e.target.value)}
                className={cn(inputClasses, 'h-9 w-auto')}>
                
                {sortOptions.map((o) =>
                <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                )}
              </select>
            </div>
          </div>

          <ProductGrid
            products={sorted?.slice(0, visible)}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => refetch()}
            emptyTitle={hasFilters ? 'No products match your filters' : 'No products available'}
            emptyDescription={hasFilters ? 'Try a different search term, category, or price range.' : undefined}
            emptyAction={hasFilters && <Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
            skeletonCount={12} />
          

          {sorted && sorted.length > visible &&
          <div className="mt-10 flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Show more ({sorted.length - visible} remaining)
              </Button>
            </div>
          }
        </section>
      </div>
    </div>);

}