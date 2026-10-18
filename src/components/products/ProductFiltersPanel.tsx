import React from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

export type FilterKey = 'q' | 'category' | 'min' | 'max';

interface ProductFiltersPanelProps {
  q: string;
  category: string;
  min: string;
  max: string;
  priceError?: string;
  hasFilters: boolean;
  onChange: (key: FilterKey, value: string) => void;
  onClear: () => void;
}

const sectionLabel = 'mb-2.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground';

export function ProductFiltersPanel({
  q,
  category,
  min,
  max,
  priceError,
  hasFilters,
  onChange,
  onClear
}: ProductFiltersPanelProps) {
  const categories = useCategories();

  const options = [{ value: '', label: 'All Categories' }, ...(categories.data ?? []).map((c) => ({ value: String(c.id), label: c.name }))];

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-base font-semibold">Filters</h2>
        {hasFilters &&
        <Button variant="ghost" size="sm" onClick={onClear} className="-mr-2 h-7 px-2 text-primary">
            Clear all
          </Button>
        }
      </div>

      <div className="space-y-7 pt-5">
        <div>
          <label htmlFor="filter-search" className={sectionLabel}>Search</label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="filter-search"
              type="search"
              placeholder="Product name"
              value={q}
              onChange={(e) => onChange('q', e.target.value)}
              className="pl-9" />
            
          </div>
        </div>

        <fieldset className="min-w-0">
          <legend className={sectionLabel}>Category</legend>
          {categories.isLoading ?
          <div className="space-y-2" role="status" aria-label="Loading categories">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
            </div> :
          categories.isError ?
          <div className="text-sm text-muted-foreground">
              Categories unavailable.{' '}
              <button type="button" onClick={() => categories.refetch()} className="font-medium text-primary hover:underline">
                Retry
              </button>
            </div> :

          <ul role="radiogroup" aria-label="Category" className="max-h-64 min-w-0 space-y-0.5 overflow-y-auto overflow-x-hidden p-0.5 pr-1.5">
              {options.map((opt) => {
              const selected = category === opt.value;
              return (
                <li key={opt.value || 'all'} className="min-w-0">
                    <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    title={opt.label}
                    onClick={() => onChange('category', opt.value)}
                    className={cn(
                      'block w-full min-w-0 truncate rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      selected ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    )}>
                    
                      {opt.label}
                    </button>
                  </li>);

            })}
            </ul>
          }
        </fieldset>

        <fieldset className="min-w-0">
          <legend className={sectionLabel}>Price range (USD)</legend>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="filter-min" className="sr-only">Minimum price</label>
              <Input
                id="filter-min"
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="Min"
                value={min}
                onChange={(e) => onChange('min', e.target.value)}
                aria-invalid={Boolean(priceError)}
                aria-describedby={priceError ? 'price-error' : undefined} />
              
            </div>
            <div>
              <label htmlFor="filter-max" className="sr-only">Maximum price</label>
              <Input
                id="filter-max"
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="Max"
                value={max}
                onChange={(e) => onChange('max', e.target.value)}
                aria-invalid={Boolean(priceError)}
                aria-describedby={priceError ? 'price-error' : undefined} />
              
            </div>
          </div>
          {priceError &&
          <p id="price-error" className="mt-1.5 text-sm text-destructive">{priceError}</p>
          }
        </fieldset>
      </div>
    </div>);

}