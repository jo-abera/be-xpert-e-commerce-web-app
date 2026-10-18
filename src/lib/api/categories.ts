import type { Category, CategoryInput, Product } from "@/types/product";

import { apiRequest } from "./client";
import { sanitizeCategories, sanitizeProducts } from "./sanitize";

export const categoriesApi = {
  list: (signal?: AbortSignal) =>
    apiRequest<Category[]>("/categories", { signal }).then(sanitizeCategories),
  get: (id: number, signal?: AbortSignal) =>
    apiRequest<Category>(`/categories/${id}`, { signal }),
  getBySlug: (slug: string, signal?: AbortSignal) =>
    apiRequest<Category>(`/categories/slug/${encodeURIComponent(slug)}`, {
      signal,
    }),
  products: (id: number, signal?: AbortSignal) =>
    apiRequest<Product[]>(`/categories/${id}/products`, { signal }).then(
      sanitizeProducts,
    ),
  create: (input: CategoryInput) =>
    apiRequest<Category>("/categories", { method: "POST", body: input }),
  update: (id: number, input: Partial<CategoryInput>) =>
    apiRequest<Category>(`/categories/${id}`, { method: "PUT", body: input }),
};
