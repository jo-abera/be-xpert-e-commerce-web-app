import React, { useState } from 'react';
import { FormField } from '../ui/FormField';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/alert-message';
import { ProductImage } from '../ui/ProductImage';
import { hasErrors, isHttpUrl, type FieldErrors } from '@/utils/validation';
import type { Category, CategoryInput } from '@/types/product';

interface CategoryFormProps {
  initial?: Category;
  submitLabel: string;
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (input: CategoryInput) => void;
  onCancel: () => void;
}

export function CategoryForm({ initial, submitLabel, isSubmitting, error, onSubmit, onCancel }: CategoryFormProps) {
  const [values, setValues] = useState<CategoryInput>({ name: initial?.name ?? '', image: initial?.image ?? '' });
  const [errors, setErrors] = useState<FieldErrors<CategoryInput>>({});

  const set = (key: keyof CategoryInput, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const next: FieldErrors<CategoryInput> = {
      name: values.name.trim().length >= 2 ? undefined : 'Enter a name (at least 2 characters).',
      image: !values.image.trim() ? 'Add an image URL.' : !isHttpUrl(values.image) ? 'Enter a valid http(s) URL.' : undefined
    };
    setErrors(next);
    if (hasErrors(next)) return;
    onSubmit({ name: values.name.trim(), image: values.image.trim() });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {error && <Alert tone="error" title="Couldn't save category">{error}</Alert>}
      <FormField id="cf-name" label="Name" error={errors.name}>
        <Input id="cf-name" value={values.name} onChange={(e) => set('name', e.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'cf-name-error' : undefined} />
      </FormField>
      <FormField id="cf-image" label="Image URL" error={errors.image}>
        <Input id="cf-image" type="url" placeholder="https://…" value={values.image} onChange={(e) => set('image', e.target.value)} aria-invalid={Boolean(errors.image)} aria-describedby={errors.image ? 'cf-image-error' : undefined} />
      </FormField>
      {isHttpUrl(values.image) &&
      <ProductImage src={values.image} alt="Category image preview" className="aspect-[4/3] w-48 rounded-lg border border-border" />
      }
      <div className="flex flex-wrap gap-2 border-t border-border pt-6">
        <Button type="submit" loading={isSubmitting}>{submitLabel}</Button>
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
      </div>
    </form>);

}