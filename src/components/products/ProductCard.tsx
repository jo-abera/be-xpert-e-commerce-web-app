'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBagIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/Button';
import { ProductImage } from '../ui/ProductImage';
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from '@/utils/format';
import {
  getProductDisplayTitle,
  getProductImageUrl,
} from '@/utils/product-display';
import type { Product } from '@/types/product';

export function ProductCard({ product }: {product: Product;}) {
  const addItem = useCartStore((s) => s.addItem);
  const href = `/products/${product.id}`;

  const handleAdd = () => {
    addItem(product, 1);
    toast.success('Added to cart', {
      description: getProductDisplayTitle(product),
    });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-200 ease-out hover:shadow-md">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden bg-muted">
        <ProductImage
          src={getProductImageUrl(product)}
          alt={getProductDisplayTitle(product)}
          className="aspect-square w-full transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
        
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="truncate text-xs font-medium text-primary">{product.category?.name ?? 'Uncategorized'}</p>
        <h3 className="mt-1.5 line-clamp-2 font-sans text-sm font-medium leading-snug text-foreground">
          <Link href={href} className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {getProductDisplayTitle(product)}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-heading text-lg font-bold tabular-nums">{formatPrice(product.price)}</span>
          <Button size="icon" variant="secondary" className="h-9 w-9" onClick={handleAdd} aria-label={`Add ${getProductDisplayTitle(product)} to cart`}>
            <ShoppingBagIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>);

}