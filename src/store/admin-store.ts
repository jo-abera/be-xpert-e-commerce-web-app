import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * DEVELOPMENT-ONLY admin state.
 * - devAccess: a client-side flag to demo the dashboard. It is NOT secure authorization.
 * - created*Ids: records created from this browser (used for “Created by you” labels).
 */
interface AdminState {
  devAccess: boolean;
  createdProductIds: number[];
  createdCategoryIds: number[];
  enableDevAccess: () => void;
  disableDevAccess: () => void;
  trackProduct: (id: number) => void;
  trackCategory: (id: number) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      devAccess: false,
      createdProductIds: [],
      createdCategoryIds: [],
      enableDevAccess: () => set({ devAccess: true }),
      disableDevAccess: () => set({ devAccess: false }),
      trackProduct: (id) =>
        set((s) => ({
          createdProductIds: [...new Set([...s.createdProductIds, id])],
        })),
      trackCategory: (id) =>
        set((s) => ({
          createdCategoryIds: [...new Set([...s.createdCategoryIds, id])],
        })),
    }),
    { name: "nexus-admin" },
  ),
);
