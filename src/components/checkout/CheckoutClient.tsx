'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBagIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Alert } from '@/components/ui/alert-message';
import { StateMessage } from '@/components/ui/StateMessage';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { selectItemCount, selectSubtotal, useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useProfile } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { hasErrors, isEmail, isPhone, type FieldErrors } from '@/utils/validation';
import type { CheckoutFormData } from '@/types/cart';

const emptyForm: CheckoutFormData = { fullName: '', email: '', phone: '', address: '', city: '' };

function validate(values: CheckoutFormData): FieldErrors<CheckoutFormData> {
  return {
    fullName: values.fullName.trim() ? undefined : 'Enter your full name.',
    email: !values.email.trim() ? 'Enter your email.' : !isEmail(values.email) ? 'Enter a valid email address.' : undefined,
    phone: !values.phone.trim() ? 'Enter your phone number.' : !isPhone(values.phone) ? 'Enter a valid phone number.' : undefined,
    address: values.address.trim() ? undefined : 'Enter a delivery address.',
    city: values.city.trim() ? undefined : 'Enter your city.'
  };
}

const fields: Array<{key: keyof CheckoutFormData;label: string;type: string;autoComplete: string;span?: boolean;}> = [
{ key: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name', span: true },
{ key: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
{ key: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel' },
{ key: 'address', label: 'Delivery address', type: 'text', autoComplete: 'street-address', span: true },
{ key: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' }];


export function CheckoutClient() {
  useDocumentTitle('Checkout');
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const totalItems = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const setLastOrder = useOrderStore((s) => s.setLastOrder);
  const { data: profile } = useProfile();

  const [values, setValues] = useState<CheckoutFormData>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors<CheckoutFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setValues((v) => ({ ...v, fullName: v.fullName || profile.name, email: v.email || profile.email }));
  }, [profile]);

  if (items.length === 0 && !submitting) {
    return (
      <div>
        <PageHeader title="Checkout" />
        <StateMessage
          icon={ShoppingBagIcon}
          title="Your cart is empty"
          description="Add some products before checking out."
          action={<Link href="/products" className={buttonVariants('primary')}>Browse products</Link>} />
        
      </div>);

  }

  const handleChange = (key: keyof CheckoutFormData, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstKey = fields.find((f) => nextErrors[f.key])?.key;
      if (firstKey) document.getElementById(`checkout-${firstKey}`)?.focus();
      return;
    }
    setSubmitting(true);
    // Simulated: no payment or backend order is created.
    window.setTimeout(() => {
      setLastOrder({
        reference: `DEMO-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        placedAt: new Date().toISOString(),
        items,
        totalItems,
        subtotal,
        customer: {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          city: values.city.trim()
        }
      });
      router.replace('/checkout/success');
      clearCart();
    }, 600);
  };

  return (
    <div>
      <PageHeader title="Checkout" back={{ to: '/cart', label: 'Back to cart' }} />
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <form noValidate onSubmit={handleSubmit} aria-labelledby="delivery-title" className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <Alert tone="info" title="This is a simulated checkout">
            No payment is taken and no real order or shipment is created.
          </Alert>
          <h2 id="delivery-title" className="text-lg font-semibold">Delivery details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => {
              const id = `checkout-${f.key}`;
              return (
                <div key={f.key} className={f.span ? 'sm:col-span-2' : undefined}>
                  <FormField id={id} label={f.label} error={errors[f.key]}>
                    <Input
                      id={id}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      value={values[f.key]}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      aria-invalid={Boolean(errors[f.key])}
                      aria-describedby={errors[f.key] ? `${id}-error` : undefined}
                      required />
                    
                  </FormField>
                </div>);

            })}
          </div>
          <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
            Place order
          </Button>
        </form>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <OrderSummary items={items} />
        </div>
      </div>
    </div>);

}