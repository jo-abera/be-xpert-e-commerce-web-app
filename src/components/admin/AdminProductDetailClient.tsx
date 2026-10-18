'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangleIcon, ExternalLinkIcon, PackageXIcon, PencilIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProductImage } from '@/components/ui/ProductImage';
import { StateMessage } from '@/components/ui/StateMessage';
import { PageLoader } from '@/components/ui/PageLoader';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useProduct } from '@/hooks/useProducts';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage, isNotFoundError } from '@/lib/api/client';
import { formatDate, formatPrice } from '@/utils/format';

export function AdminProductDetail({ productId: id }: { productId: string }) {
  const productId = Number(id);
  const { data: product, isLoading, isError, error, refetch } = useProduct(productId);
  useDocumentTitle(product ? `Admin · ${product.title}` : 'Admin · Product');

  if (!Number.isInteger(productId) || productId <= 0 || isError && isNotFoundError(error)) {
    return <StateMessage icon={PackageXIcon} title="Product not found" action={<Link href="/admin/products" className={buttonVariants('primary')}>Back to products</Link>} />;
  }
  if (isLoading) return <PageLoader label="Loading product…" />;
  if (isError || !product) {
    return <StateMessage tone="error" icon={AlertTriangleIcon} title="We couldn't load this product" description={getErrorMessage(error)} action={<Button variant="outline" onClick={() => refetch()}>Try again</Button>} />;
  }

  const details: Array<[string, React.ReactNode]> = [
  ['ID', `#${product.id}`],
  ['Slug', <span className="font-mono text-xs">{product.slug}</span>],
  ['Price', formatPrice(product.price)],
  ['Category', product.category?.name ?? '—'],
  ['Created', formatDate(product.creationAt)],
  ['Updated', formatDate(product.updatedAt)]];


  return (
    <div>
      <PageHeader
        title={product.title}
        back={{ to: '/admin/products', label: 'All products' }}
        actions={
        <>
            <Link href={`/products/${product.id}`} className={buttonVariants('ghost')}><ExternalLinkIcon aria-hidden="true" />View in store</Link>
            <Link href={`/admin/products/${product.id}/edit`} className={buttonVariants('primary')}><PencilIcon aria-hidden="true" />Edit</Link>
          </>
        } />
      
      <div className="grid gap-10 md:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          <ProductImage src={product.images[0]} alt={product.title} className="aspect-square w-full rounded-lg border border-border" />
          {product.images.length > 1 &&
          <div className="flex gap-2">
              {product.images.slice(1).map((src, i) => <ProductImage key={src + i} src={src} alt="" className="h-14 w-14 rounded-md border border-border" />)}
            </div>
          }
        </div>
        <div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
            {details.map(([label, value]) =>
            <div key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 break-words">{value}</dd>
              </div>
            )}
          </dl>
          <h2 className="mt-8 text-sm font-medium text-muted-foreground">Description</h2>
          <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">{product.description || '—'}</p>
        </div>
      </div>
    </div>);

}