'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangleIcon, PackageXIcon, ShoppingBagIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '@/components/ui/Button';
import { ProductImage } from '@/components/ui/ProductImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { StateMessage } from '@/components/ui/StateMessage';
import { QuantitySelector } from '@/components/cart/QuantitySelector';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useProduct, useRelatedProducts } from '@/hooks/useProducts';
import { useCartStore } from "@/store/cart-store";
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getErrorMessage, isNotFoundError } from '@/lib/api/client';
import { formatPrice } from '@/utils/format';
import {
  filterStorefrontProducts,
  getProductDisplayTitle,
  getProductImageGallery,
} from '@/utils/product-display';
import { cn } from '@/lib/utils';

export function ProductDetailClient({ productId: id }: { productId: string }) {
  const router = useRouter();
  const productId = Number(id);
  const { data: product, isLoading, isError, error, refetch } = useProduct(productId);
  const related = useRelatedProducts(productId, Boolean(product));
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useDocumentTitle(product ? getProductDisplayTitle(product) : 'Product');

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
  }, [productId]);

  const invalidId = !Number.isInteger(productId) || productId <= 0;

  if (invalidId || isError && isNotFoundError(error)) {
    return (
      <StateMessage
        icon={PackageXIcon}
        title="Product not found"
        description="This product may have been removed or the link is incorrect."
        action={<Link href="/products" className={buttonVariants('primary')}>Back to products</Link>}
        className="mt-8" />);


  }

  if (isLoading) {
    return (
      <div className="grid gap-10 md:grid-cols-2" role="status" aria-label="Loading product">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-48" />
        </div>
      </div>);

  }

  if (isError || !product) {
    return (
      <StateMessage
        tone="error"
        icon={AlertTriangleIcon}
        title="We couldn't load this product"
        description={getErrorMessage(error)}
        action={
        <>
            <Button variant="outline" onClick={() => refetch()}>Try again</Button>
            <Link href="/products" className={buttonVariants('ghost')}>Back to products</Link>
          </>
        }
        className="mt-8" />);


  }

  const images = getProductImageGallery(product);
  const displayTitle = getProductDisplayTitle(product);
  const relatedProducts = filterStorefrontProducts(
    related.data?.filter((p) => p.id !== product.id) ?? [],
  ).slice(0, 4);

  const handleAdd = () => {
    addItem(product, quantity);
    toast.success(`Added ${quantity} to cart`, {
      description: displayTitle,
      action: { label: 'View cart', onClick: () => router.push('/cart') }
    });
  };

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/products" className="hover:text-foreground">Products</Link></li>
          {product.category &&
          <>
              <li aria-hidden="true">/</li>
              <li><Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">{product.category.name}</Link></li>
            </>
          }
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate text-foreground">{displayTitle}</li>
        </ol>
      </nav>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <ProductImage src={images[activeImage]} alt={displayTitle} className="aspect-square w-full" />
          </div>
          {images.length > 1 &&
          <div className="mt-3 flex gap-2" role="group" aria-label="Product images">
              {images.map((src, i) =>
            <button
              key={src + i}
              type="button"
              onClick={() => setActiveImage(i)}
              aria-label={`Show image ${i + 1}`}
              aria-pressed={i === activeImage}
              className={cn(
                'overflow-hidden rounded-md border-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                i === activeImage ? 'border-foreground' : 'border-transparent hover:border-border'
              )}>
              
                  <ProductImage src={src} alt="" className="h-16 w-16" />
                </button>
            )}
            </div>
          }
        </div>

        <div>
          {product.category &&
          <Link href={`/categories/${product.category.slug}`} className="text-sm text-muted-foreground hover:text-foreground">
              {product.category.name}
            </Link>
          }
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{displayTitle}</h1>
          <p className="mt-3 text-2xl font-semibold tabular-nums">{formatPrice(product.price)}</p>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">
            {product.description || 'No description provided.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <QuantitySelector value={quantity} onChange={setQuantity} label="Quantity" />
            <Button size="lg" onClick={handleAdd}>
              <ShoppingBagIcon aria-hidden="true" />
              Add to cart
            </Button>
          </div>
        </div>
      </div>

      <section aria-labelledby="related-title" className="mt-20">
        <h2 id="related-title" className="mb-5 text-xl font-semibold tracking-tight">Related products</h2>
        <ProductGrid
          products={relatedProducts}
          isLoading={related.isLoading}
          isError={related.isError}
          error={related.error}
          onRetry={() => related.refetch()}
          emptyTitle="No related products"
          emptyDescription="There are no other products in this category yet."
          skeletonCount={4} />
        
      </section>
    </div>);

}