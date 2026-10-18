import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';
import { useAdminStore } from "@/store/admin-store";
import type { CategoryInput } from '@/types/product';

export const categoryKeys = {
  all: ['categories'] as const,
  list: ['categories', 'list'] as const,
  detail: (id: number) => ['categories', 'detail', id] as const,
  slug: (slug: string) => ['categories', 'slug', slug] as const,
  products: (id: number) => ['categories', 'products', id] as const
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list,
    queryFn: ({ signal }) => categoriesApi.list(signal)
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: ({ signal }) => categoriesApi.get(id, signal),
    enabled: Number.isInteger(id) && id > 0
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.slug(slug),
    queryFn: ({ signal }) => categoriesApi.getBySlug(slug, signal),
    enabled: Boolean(slug)
  });
}

export function useCategoryProducts(id?: number) {
  return useQuery({
    queryKey: categoryKeys.products(id ?? 0),
    queryFn: ({ signal }) => categoriesApi.products(id as number, signal),
    enabled: typeof id === 'number'
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  const trackCategory = useAdminStore((s) => s.trackCategory);
  return useMutation({
    mutationFn: (input: CategoryInput) => categoriesApi.create(input),
    onSuccess: (category) => {
      trackCategory(category.id);
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    }
  });
}

export function useUpdateCategory(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<CategoryInput>) => categoriesApi.update(id, input),
    onSuccess: (category) => {
      qc.setQueryData(categoryKeys.detail(id), category);
      qc.invalidateQueries({ queryKey: categoryKeys.list });
    }
  });
}