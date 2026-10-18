'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2Icon, ReceiptIcon } from 'lucide-react';
import { StateMessage } from '@/components/ui/StateMessage';
import { buttonVariants } from '@/components/ui/Button';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { useOrderStore } from "@/store/order-store";
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatDate } from '@/utils/format';

export function CheckoutSuccessClient() {
  useDocumentTitle('Order confirmed');
  const order = useOrderStore((s) => s.lastOrder);

  if (!order) {
    return (
      <StateMessage
        icon={ReceiptIcon}
        title="No recent order"
        description="There's no simulated order to show. Place one from your cart first."
        action={<Link href="/products" className={buttonVariants('primary')}>Continue shopping</Link>}
        className="mt-8" />);


  }

  const { customer } = order;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="border-b border-border pb-8">
        <CheckCircle2Icon className="h-10 w-10 text-success" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Thanks, {customer.fullName.split(' ')[0]} — your order is placed.</h1>
        <p className="mt-2 text-muted-foreground">
          This was a simulated checkout for demonstration. No payment was taken and nothing will be shipped.
        </p>
        <p className="mt-4 text-sm">
          Demo reference <span className="font-mono font-medium">{order.reference}</span>
          <span className="text-muted-foreground"> · {formatDate(order.placedAt)}</span>
        </p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <section aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" className="text-base font-semibold">Delivery details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
            ['Name', customer.fullName],
            ['Email', customer.email],
            ['Phone', customer.phone],
            ['Address', `${customer.address}, ${customer.city}`]].
            map(([label, value]) =>
            <div key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 break-words">{value}</dd>
              </div>
            )}
          </dl>
          <Link href="/products" className={buttonVariants('primary', 'lg', 'mt-8')}>
            Continue shopping
          </Link>
        </section>
        <OrderSummary items={order.items} title="Items ordered" />
      </div>
    </div>);

}