import React from 'react';
import { ProductImage } from '../ui/ProductImage';
import { formatPrice } from '@/utils/format';
import type { CartItem } from '@/types/cart';

interface OrderSummaryProps {
  items: CartItem[];
  title?: string;
  children?: React.ReactNode;
}

export function OrderSummary({ items, title = 'Order summary', children }: OrderSummaryProps) {
  const totalItems = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

  return (
    <section aria-labelledby="order-summary-title" className="rounded-lg border border-border bg-card p-5">
      <h2 id="order-summary-title" className="text-base font-semibold">
        {title}
      </h2>
      <ul className="mt-4 divide-y divide-border">
        {items.map((item) =>
        <li key={item.productId} className="flex gap-3 py-3">
            <ProductImage src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <p className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</p>
          </li>
        )}
      </ul>
      <dl className="mt-2 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Items</dt>
          <dd className="tabular-nums">{totalItems}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="text-muted-foreground">Not applicable (demo)</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      {children && <div className="mt-5">{children}</div>}
    </section>);

}