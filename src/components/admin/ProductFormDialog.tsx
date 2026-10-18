import React, { useState } from 'react';
import { FormField } from '../ui/FormField';
import { Input, inputClasses } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/alert-message';
import { useCategories } from '@/hooks/useCategories';
import { hasErrors, isHttpUrl, type FieldErrors } from '@/utils/validation';
import { cn } from '@/lib/utils';
import type { Product, ProductInput } from '@/types/product';

interface FormValues {
  title: string;
  price: string;
  description: string;
  categoryId: string;
  images: string;
}

interface ProductFormProps {
  initial?: Product;
  submitLabel: string;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (input: ProductInput) => void;
  onCancel: () => void;
}

function parseImages(raw: string): string[] {
  return raw.split('\n').map((s) => s.trim()).filter(Boolean);
}

function validate(v: FormValues): FieldErrors<FormValues> {
  const price = Number(v.price);
  const images = parseImages(v.images);
  return {
    title: v.title.trim().length >= 2 ? undefined : 'Enter a title (at least 2 characters).',
    price: !v.price.trim() ? 'Enter a price.' : !Number.isFinite(price) || price <= 0 ? 'Price must be greater than 0.' : undefined,
    description: v.description.trim().length >= 5 ? undefined : 'Enter a description (at least 5 characters).',
    categoryId: v.categoryId ? undefined : 'Choose a category.',
    images: images.length === 0 ? 'Add at least one image URL.' : images.some((u) => !isHttpUrl(u)) ? 'Each line must be a valid http(s) URL.' : undefined
  };
}

export function ProductForm({ initial, submitLabel, isSubmitting, error, onSubmit, onCancel }: ProductFormProps) {
  const categories = useCategories();
  const [values, setValues] = useState<FormValues>({
    title: initial?.title ?? '',
    price: initial ? String(initial.price) : '',
    description: initial?.description ?? '',
    categoryId: initial?.category ? String(initial.category.id) : '',
    images: initial?.images.join('\n') ?? ''
  });
  const [errors, setErrors] = useState<FieldErrors<FormValues>>({});

  const set = (key: keyof FormValues, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const next = validate(values);
    setErrors(next);
    if (hasErrors(next)) return;
    onSubmit({
      title: values.title.trim(),
      price: Number(values.price),
      description: values.description.trim(),
      categoryId: Number(values.categoryId),
      images: parseImages(values.images)
    });
  };

  const aria = (key: keyof FormValues) => ({
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `pf-${key}-error` : undefined
  });

  return (
    <form noValidate onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && <Alert tone="error" title="Couldn't save product">{error}</Alert>}
      <FormField id="pf-title" label="Title" error={errors.title}>
        <Input id="pf-title" value={values.title} onChange={(e) => set('title', e.target.value)} {...aria('title')} />
      </FormField>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField id="pf-price" label="Price (USD)" error={errors.price}>
          <Input id="pf-price" type="number" inputMode="decimal" min={0} step="0.01" value={values.price} onChange={(e) => set('price', e.target.value)} {...aria('price')} />
        </FormField>
        <FormField id="pf-categoryId" label="Category" error={errors.categoryId ?? (categories.isError ? 'Categories could not be loaded.' : undefined)}>
          <select
            id="pf-categoryId"
            value={values.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
            disabled={categories.isLoading}
            className={cn(inputClasses, 'h-10')}
            {...aria('categoryId')}>
            
            <option value="">{categories.isLoading ? 'Loading…' : 'Select a category'}</option>
            {categories.data?.map((c) =>
            <option key={c.id} value={c.id}>{c.name}</option>
            )}
          </select>
        </FormField>
      </div>
      <FormField id="pf-description" label="Description" error={errors.description}>
        <textarea id="pf-description" rows={5} value={values.description} onChange={(e) => set('description', e.target.value)} className={inputClasses} {...aria('description')} />
      </FormField>
      <FormField id="pf-images" label="Image URLs" error={errors.images} hint="One URL per line. The first image is used as the cover.">
        <textarea id="pf-images" rows={3} value={values.images} onChange={(e) => set('images', e.target.value)} placeholder="https://…" className={cn(inputClasses, 'font-mono text-xs')} {...aria('images')} />
      </FormField>
      <div className="flex flex-wrap gap-2 border-t border-border pt-6">
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
      </div>
    </form>);

}