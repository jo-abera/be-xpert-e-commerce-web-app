'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangleIcon, ChevronDownIcon, ExternalLinkIcon, EyeIcon, PackageSearchIcon, PencilIcon, PlusIcon, RefreshCwIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Badge } from '@/components/ui/app-badge';
import { ProductImage } from '@/components/ui/ProductImage';
import { StateMessage } from '@/components/ui/StateMessage';
import { inputClasses } from '@/components/ui/Input';
import { AdminTableShell } from '@/components/admin/AdminTableShell';
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton';
import { AdminSearchInput } from '@/components/admin/AdminSearchInput';
import { IconAction } from '@/components/admin/IconAction';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useAdminStore } from "@/store/admin-store";
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage } from '@/lib/api/client';
import { sortProducts } from '@/utils/products';
import { formatDate, formatPrice } from '@/utils/format';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 25;

const columns = [
{ label: 'Product' },
{ label: 'Category' },
{ label: 'Price' },
{ label: 'Created' },
{ label: 'Actions', className: 'text-right' }];


export function AdminProducts() {
  useDocumentTitle('Manage products');
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const debounced = useDebouncedValue(search.trim(), 350);
  const categories = useCategories();
  const { data, isLoading, isError, error, refetch, isFetching } = useProducts({
    title: debounced || undefined,
    categoryId: categoryId ? Number(categoryId) : undefined
  });
  const createdIds = useAdminStore((s) => s.createdProductIds);
  const rows = useMemo(() => data ? sortProducts(data, 'newest') : [], [data]);
  const filtered = Boolean(debounced || categoryId);

  return (
    <div>
      <PageHeader
        title="Products"
        description="Create, edit, and manage your catalog inventory."
        actions={
        <Link href="/admin/products/new" className={buttonVariants('primary', 'lg')}>
            <PlusIcon aria-hidden="true" />
            Add Product
          </Link>
        } />
      

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearchInput
          id="admin-product-search"
          label="Search products"
          placeholder="Search products by title…"
          value={search}
          onChange={(v) => {setSearch(v);setVisible(PAGE_SIZE);}} />
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <label htmlFor="admin-product-category" className="sr-only">Filter by category</label>
            <select
              id="admin-product-category"
              value={categoryId}
              onChange={(e) => {setCategoryId(e.target.value);setVisible(PAGE_SIZE);}}
              className={cn(inputClasses, 'h-11 w-52 appearance-none rounded-xl bg-card pr-9 shadow-sm')}>
              
              <option value="">All Categories</option>
              {categories.data?.map((c) =>
              <option key={c.id} value={c.id}>{c.name}</option>
              )}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl bg-card shadow-sm"
            onClick={() => refetch()}
            aria-label="Refresh products"
            title="Refresh">
            
            <RefreshCwIcon className={cn(isFetching && 'animate-spin')} aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isLoading ?
      <AdminTableSkeleton label="Loading products" /> :
      isError ?
      <StateMessage tone="error" icon={AlertTriangleIcon} title="We couldn't load products" description={getErrorMessage(error)} action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>} className="bg-card" /> :
      rows.length === 0 ?
      <StateMessage icon={PackageSearchIcon} title={filtered ? 'No matching products' : 'No products yet'} description={filtered ? 'Try a different title or category.' : undefined} className="bg-card" /> :

      <AdminTableShell
        columns={columns}
        footer={
        <>
              <span>Showing {Math.min(visible, rows.length)} of {rows.length} products</span>
              {rows.length > visible &&
          <Button variant="ghost" size="sm" onClick={() => setVisible((v) => v + PAGE_SIZE)}>Load more</Button>
          }
            </>
        }>
        
          {rows.slice(0, visible).map((p) => {
          const owned = createdIds.includes(p.id);
          return (
            <tr key={p.id} className="transition-colors duration-150 hover:bg-muted/30">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-4">
                    <ProductImage src={p.images[0]} alt="" className="h-12 w-12 shrink-0 rounded-lg border border-border" />
                    <div className="min-w-0">
                      <Link href={`/admin/products/${p.id}`} className="line-clamp-1 font-medium text-foreground hover:text-primary">
                        {p.title}
                      </Link>
                      {owned && <p className="mt-0.5 text-xs text-success">Created by you</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {p.category ? <Badge className="max-w-[12rem]">{p.category.name}</Badge> : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-5 py-3.5 font-semibold tabular-nums">{formatPrice(p.price)}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-muted-foreground">{formatDate(p.creationAt)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-0.5">
                    <IconAction icon={ExternalLinkIcon} label={`View ${p.title} in store`} href={`/products/${p.id}`} />
                    <IconAction icon={EyeIcon} label={`View details for ${p.title}`} href={`/admin/products/${p.id}`} />
                    <IconAction
                    icon={PencilIcon}
                    label={`Edit ${p.title}`}
                    href={`/admin/products/${p.id}/edit`}
                    />
                  
                  </div>
                </td>
              </tr>);

        })}
        </AdminTableShell>
      }
    </div>);

}