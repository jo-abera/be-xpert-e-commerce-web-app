import type { Product, ProductFilters, ProductInput } from "@/types/product";

import { apiRequest } from "./client";
import { sanitizeProduct, sanitizeProducts } from "./sanitize";

function productQuery(filters: ProductFilters): string {
  const params = new URLSearchParams();
  if (filters.title) params.set("title", filters.title);
  if (filters.categoryId) params.set("categoryId", String(filters.categoryId));
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    params.set("price_min", String(filters.priceMin ?? 0));
    params.set("price_max", String(filters.priceMax ?? 1_000_000));
  }
  if (filters.limit !== undefined) {
    params.set("offset", String(filters.offset ?? 0));
    params.set("limit", String(filters.limit));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const productsApi = {
  list: (filters: ProductFilters, signal?: AbortSignal) =>
    apiRequest<Product[]>(`/products${productQuery(filters)}`, { signal }).then(
      sanitizeProducts,
    ),
  get: async (id: number, signal?: AbortSignal) => {
    const product = sanitizeProduct(
      await apiRequest<Product>(`/products/${id}`, { signal }),
    );
    if (!product) throw new Error("This product has invalid data.");
    return product;
  },
  related: (id: number, signal?: AbortSignal) =>
    apiRequest<Product[]>(`/products/${id}/related`, { signal }).then(
      sanitizeProducts,
    ),
  create: async (input: ProductInput) => {
    const product = sanitizeProduct(
      await apiRequest<Product>("/products", { method: "POST", body: input }),
    );
    if (!product) throw new Error("The API returned an invalid product.");
    return product;
  },
  update: async (id: number, input: Partial<ProductInput>) => {
    const product = sanitizeProduct(
      await apiRequest<Product>(`/products/${id}`, {
        method: "PUT",
        body: input,
      }),
    );
    if (!product) throw new Error("The API returned an invalid product.");
    return product;
  },
};
