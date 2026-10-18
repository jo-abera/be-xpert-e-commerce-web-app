'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { buttonVariants, Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { ProductImage } from '@/components/ui/ProductImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { Alert } from '@/components/ui/alert-message';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatPrice } from '@/utils/format';
import {
  filterStorefrontProducts,
  getProductDisplayTitle,
  getProductImageUrl,
} from '@/utils/product-display';

const HOME_FILTERS = { limit: 9, offset: 0 };

function SectionHeading({ id, title, description, href, linkLabel }: {id: string;title: string;description: string;href: string;linkLabel: string;}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
        {linkLabel} <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>);

}

export function Hero() {
  useDocumentTitle();
  const products = useProducts(HOME_FILTERS);
  const categories = useCategories();
  const catalog = filterStorefrontProducts(products.data ?? []);
  const featured = catalog[0];
  const gridProducts = catalog.slice(1, 9);

  return (
    <div className="space-y-20">
      <section className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-[1.15fr_1fr]">
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight lg:text-5xl">
            Quality essentials,
            <br className="hidden sm:block" /> chosen with care.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Shop clothing, electronics, furniture and more from a live catalog. Your cart is saved automatically while
            you browse or sign in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className={buttonVariants('primary', 'lg')}>
              Shop all products
            </Link>
            <Link href="/categories" className={buttonVariants('outline', 'lg')}>
              Browse categories
            </Link>
          </div>
        </div>

        <div className="relative min-h-[280px] bg-muted">
          {products.isLoading ?
          <Skeleton className="absolute inset-0 rounded-none" /> :
          featured ?
          <>
              <ProductImage src={getProductImageUrl(featured)} alt={getProductDisplayTitle(featured)} className="absolute inset-0 h-full w-full" />
              <Link
              href={`/products/${featured.id}`}
              className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-xl bg-card/95 p-4 shadow-lg backdrop-blur transition-colors duration-150 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Newest in the catalog</p>
                  <p className="mt-0.5 truncate text-sm font-semibold">{getProductDisplayTitle(featured)}</p>
                </div>
                <span className="shrink-0 font-heading text-lg font-bold tabular-nums">{formatPrice(featured.price)}</span>
              </Link>
            </> :
          null}
        </div>
      </section>

      <section aria-labelledby="home-categories">
        <SectionHeading id="home-categories" title="Shop by category" description="Find what you need, faster." href="/categories" linkLabel="All categories" />
        {categories.isLoading ?
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5" role="status" aria-label="Loading categories">
            {Array.from({ length: 5 }).map((_, i) =>
          <Skeleton key={i} className="aspect-[4/3.6] w-full rounded-xl" />
          )}
          </div> :
        categories.isError ?
        <Alert tone="error" title="Categories couldn't be loaded">
            <Button variant="outline" size="sm" className="mt-2" onClick={() => categories.refetch()}>
              Try again
            </Button>
          </Alert> :
        categories.data && categories.data.length > 0 ?
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
            {categories.data.slice(0, 5).map((category) =>
          <CategoryCard key={category.id} category={category} />
          )}
          </div> :

        <p className="text-sm text-muted-foreground">No categories are available yet.</p>
        }
      </section>

      <section aria-labelledby="home-products">
        <SectionHeading id="home-products" title="New arrivals" description="Recently added to the catalog." href="/products" linkLabel="View all products" />
        <ProductGrid
          products={gridProducts}
          isLoading={products.isLoading}
          isError={products.isError}
          error={products.error}
          onRetry={() => products.refetch()}
          emptyTitle="The catalog is empty"
          emptyDescription="No products are available from the API right now." />
        
      </section>
    </div>);

}