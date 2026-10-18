'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBagIcon, Trash2Icon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StateMessage } from '@/components/ui/StateMessage';
import { ProductImage } from '@/components/ui/ProductImage';
import { Button, buttonVariants } from '@/components/ui/Button';
import { QuantitySelector } from '@/components/cart/QuantitySelector';
import { selectItemCount, selectSubtotal, useCartStore } from "@/store/cart-store";
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatPrice } from '@/utils/format';

export function CartClient() {
  useDocumentTitle('Cart');
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const [confirmClear, setConfirmClear] = useState(false);

  if (items.length === 0) {
    return (
      <div>
        <PageHeader title="Your cart" />
        <StateMessage
          icon={ShoppingBagIcon}
          title="Your cart is empty"
          description="Products you add will appear here and stay saved on this device."
          action={<Link href="/products" className={buttonVariants('primary')}>Start shopping</Link>} />
        
      </div>);

  }

  return (
    <div>
      <PageHeader
        title="Your cart"
        description={`${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
        actions={
        confirmClear ?
        <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Remove everything?</span>
              <Button variant="destructive" size="sm" onClick={() => {clear();setConfirmClear(false);}}>
                Clear cart
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
                Cancel
              </Button>
            </div> :

        <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
              Clear cart
            </Button>

        } />
      

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-border border-y border-border">
          {items.map((item) =>
          <li key={item.productId} className="flex gap-4 py-5">
              <Link href={`/products/${item.productId}`} tabIndex={-1} aria-hidden="true" className="shrink-0">
                <ProductImage src={item.image} alt="" className="h-24 w-24 rounded-md border border-border" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/products/${item.productId}`} className="line-clamp-2 font-medium hover:underline">
                      {item.title}
                    </Link>
                    {item.categoryName && <p className="mt-0.5 text-sm text-muted-foreground">{item.categoryName}</p>}
                  </div>
                  <p className="font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-4 pt-3">
                  <QuantitySelector
                  size="sm"
                  value={item.quantity}
                  onChange={(q) => setQuantity(item.productId, q)}
                  label={`Quantity for ${item.title}`} />
                
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Remove ${item.title}`}
                  className="text-muted-foreground">
                  
                    <Trash2Icon aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          )}
        </ul>

        <aside aria-labelledby="cart-summary" className="h-fit rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 id="cart-summary" className="text-base font-semibold">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Items</dt>
              <dd className="tabular-nums">{itemCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
          </dl>
          <Button size="lg" className="mt-5 w-full" onClick={() => router.push('/checkout')}>
            Proceed to checkout
          </Button>
          <Link href="/products" className={buttonVariants('ghost', 'md', 'mt-2 w-full')}>
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>);

}