import type { Product, ProductSort } from "@/types/product";

export const sortOptions: Array<{ value: ProductSort; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
];

function time(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const list = [...products];
  switch (sort) {
    case "oldest":
      return list.sort((a, b) => time(a.creationAt) - time(b.creationAt));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name-asc":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return list.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
    default:
      return list.sort((a, b) => time(b.creationAt) - time(a.creationAt));
  }
}
