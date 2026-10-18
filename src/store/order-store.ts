import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { SimulatedOrder } from "@/types/cart";

interface OrderState {
  lastOrder: SimulatedOrder | null;
  setLastOrder: (order: SimulatedOrder) => void;
  clearLastOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      lastOrder: null,
      setLastOrder: (order) => set({ lastOrder: order }),
      clearLastOrder: () => set({ lastOrder: null }),
    }),
    { name: "nexus-last-order", storage: createJSONStorage(() => sessionStorage) },
  ),
);
