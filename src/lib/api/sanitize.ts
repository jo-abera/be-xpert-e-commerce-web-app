import { cleanImageUrls } from "@/utils/format";
import type { Category, Product } from "@/types/product";
import type { RawUser, User } from "@/types/user";

export function sanitizeProduct(raw: Product): Product | null {
  if (!raw || typeof raw.id !== "number" || !raw.title) return null;
  return {
    ...raw,
    price: Number(raw.price) || 0,
    description: raw.description ?? "",
    images: cleanImageUrls(raw.images),
    category: raw.category ?? null,
  };
}

export function sanitizeProducts(list: Product[]): Product[] {
  return (Array.isArray(list) ? list : [])
    .map(sanitizeProduct)
    .filter((p): p is Product => p !== null);
}

export function sanitizeCategories(list: Category[]): Category[] {
  return (Array.isArray(list) ? list : []).filter(
    (c) => c && typeof c.id === "number" && c.name,
  );
}

/** Never let passwords leave the service layer. */
export function sanitizeUser(raw: RawUser): User {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    role: raw.role,
    avatar: raw.avatar,
    creationAt: raw.creationAt,
    updatedAt: raw.updatedAt,
  };
}
