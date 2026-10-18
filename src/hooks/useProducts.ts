import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { useAdminStore } from "@/store/admin-store";
import type { ProductFilters, ProductInput } from '@/types/product';

export const productKeys = {
  all: ['products'] as const,
  list: (filters: ProductFilters) => ['products', 'list', filters] as const,
  detail: (id: number) => ['products', 'detail', id] as const,
  related: (id: number) => ['products', 'related', id] as const
};

const isValidId = (id: number) => Number.isInteger(id) && id > 0;

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: ({ signal }) => productsApi.list(filters, signal),
    placeholderData: keepPreviousData
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: ({ signal }) => productsApi.get(id, signal),
    enabled: isValidId(id)
  });
}

export function useRelatedProducts(id: number, enabled = true) {
  return useQuery({
    queryKey: productKeys.related(id),
    queryFn: ({ signal }) => productsApi.related(id, signal),
    enabled: enabled && isValidId(id)
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  const trackProduct = useAdminStore((s) => s.trackProduct);
  return useMutation({
    mutationFn: (input: ProductInput) => productsApi.create(input),
    onSuccess: (product) => {
      trackProduct(product.id);
      qc.invalidateQueries({ queryKey: productKeys.all });
    }
  });
}

export function useUpdateProduct(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<ProductInput>) => productsApi.update(id, input),
    onSuccess: (product) => {
      qc.setQueryData(productKeys.detail(id), product);
      qc.invalidateQueries({ queryKey: ['products', 'list'] });
    }
  });
}