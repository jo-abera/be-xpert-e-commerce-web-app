import { format } from "date-fns";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number): string {
  return currency.format(Number.isFinite(value) ? value : 0);
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : format(date, "MMM d, yyyy");
}

/** EscuelaJS images are sometimes stored as stringified arrays (e.g. '["https://..."]'). */
export function cleanImageUrls(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images.flatMap((img) => {
    if (typeof img !== "string") return [];
    return img.match(/https?:\/\/[^"'\]\s,]+/g) ?? [];
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
