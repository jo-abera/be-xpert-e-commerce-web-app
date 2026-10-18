export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category | null;
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  title?: string;
  categoryId?: number;
  priceMin?: number;
  priceMax?: number;
  limit?: number;
  offset?: number;
}

export interface ProductInput {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export interface CategoryInput {
  name: string;
  image: string;
}

export type ProductSort =
'newest' |
'oldest' |
'price-asc' |
'price-desc' |
'name-asc' |
'name-desc';