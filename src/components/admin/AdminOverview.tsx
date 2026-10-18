'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, FolderPlusIcon, PackagePlusIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { AdminStat } from '@/components/admin/AdminStat';
import { ProductImage } from '@/components/ui/ProductImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/alert-message';
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useUsers } from '@/hooks/useUsers';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { sortProducts } from '@/utils/products';
import { formatDate, formatPrice } from '@/utils/format';

const quickLinks = [
{ to: '/admin/products/new', label: 'Create a product', icon: PackagePlusIcon },
{ to: '/admin/categories/new', label: 'Create a category', icon: FolderPlusIcon },
{ to: '/admin/users', label: 'Browse users', icon: UsersIcon }];


export function AdminOverview() {
  useDocumentTitle('Admin overview');
  const products = useProducts();
  const categories = useCategories();
  const users = useUsers();

  const recent = useMemo(() => products.data ? sortProducts(products.data, 'newest').slice(0, 6) : [], [products.data]);

  return (
    <div>
      <PageHeader title="Overview" description="Live figures from the EscuelaJS API." />

      <dl className="grid divide-y divide-border rounded-xl border border-border bg-card px-6 py-2 shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-6">
        <AdminStat label="Total products" value={products.data?.length} isLoading={products.isLoading} isError={products.isError} href="/admin/products" />
        <AdminStat label="Total categories" value={categories.data?.length} isLoading={categories.isLoading} isError={categories.isError} href="/admin/categories" />
        <AdminStat label="Total users" value={users.data?.length} isLoading={users.isLoading} isError={users.isError} href="/admin/users" />
      </dl>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_260px]">
        <section aria-labelledby="recent-title">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 id="recent-title" className="text-lg font-semibold">Recently added products</h2>
            <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              View all <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          {products.isLoading ?
          <div className="space-y-3" role="status" aria-label="Loading products">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div> :
          products.isError ?
          <Alert tone="error" title="Products are unavailable">
              <Button size="sm" variant="outline" className="mt-2" onClick={() => products.refetch()}>Try again</Button>
            </Alert> :
          recent.length === 0 ?
          <p className="text-sm text-muted-foreground">No products yet.</p> :

          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card px-4 shadow-sm">
              {recent.map((p) =>
            <li key={p.id}>
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 py-3 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                    <ProductImage src={p.images[0]} alt="" className="h-10 w-10 shrink-0 rounded-md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.category?.name ?? 'Uncategorized'} · {formatDate(p.creationAt)}</p>
                    </div>
                    <span className="text-sm tabular-nums">{formatPrice(p.price)}</span>
                  </Link>
                </li>
            )}
            </ul>
          }
        </section>

        <section aria-labelledby="quick-title">
          <h2 id="quick-title" className="mb-4 text-lg font-semibold">Quick links</h2>
          <ul className="space-y-1">
            {quickLinks.map(({ to, label, icon: Icon }) =>
            <li key={to}>
                <Link href={to} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>);

}