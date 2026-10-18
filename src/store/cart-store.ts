import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

export const MAX_QUANTITY = 99;

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
}

const clamp = (n: number) => Math.max(1, Math.min(MAX_QUANTITY, Math.round(n)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: clamp(i.quantity + quantity) }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0] ?? "",
                categoryName: product.category?.name ?? "",
                quantity: clamp(quantity),
              },
            ],
          };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: clamp(quantity) } : i,
          ),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "nexus-cart" },
  ),
);

export const selectItemCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectSubtotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
