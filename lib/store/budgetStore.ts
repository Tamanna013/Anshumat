import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Budget } from "@/types/budget";

// We'll use a custom storage that handles SSR
const createPersistStorage = () => {
  if (typeof window === "undefined") {
    // Return a dummy storage for SSR
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  // Dynamically import localforage only on client
  return import("localforage").then((localforage) => ({
    getItem: async (name: string) => {
      const item = await localforage.default.getItem(name);
      return item ? JSON.parse(item as string) : null;
    },
    setItem: async (name: string, value: any) => {
      await localforage.default.setItem(name, JSON.stringify(value));
    },
    removeItem: async (name: string) => {
      await localforage.default.removeItem(name);
    },
  }));
};

interface BudgetState {
  budget: Budget | null;
  isOnline: boolean;
  syncStatus: "local" | "pending" | "synced";
  lastSaved: Date | null;

  // Actions
  setBudget: (budget: Budget) => void;
  updateCategory: (category: keyof Budget["categories"], value: number) => void;
  updateIncome: (income: number) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setSyncStatus: (status: "local" | "pending" | "synced") => void;
  markSaved: () => void;
  initialize: () => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budget: null,
      isOnline: true, // Default to true for SSR
      syncStatus: "local",
      lastSaved: null,

      setBudget: (budget) => set({ budget }),

      updateCategory: (category, value) => {
        const current = get().budget;
        if (!current) return;

        const updated = {
          ...current,
          categories: {
            ...current.categories,
            [category]: value,
          },
          updatedAt: new Date(),
          syncStatus: "pending" as const,
        };

        set({ budget: updated });
        get().markSaved();
      },

      updateIncome: (income) => {
        const current = get().budget;
        if (!current) return;

        const updated = {
          ...current,
          income,
          updatedAt: new Date(),
          syncStatus: "pending" as const,
        };

        set({ budget: updated });
        get().markSaved();
      },

      setOnlineStatus: (isOnline) => set({ isOnline }),

      setSyncStatus: (status) => {
        const current = get().budget;
        if (!current) return;

        set({
          syncStatus: status,
          budget: {
            ...current,
            syncStatus: status,
            syncedAt: status === "synced" ? new Date() : current.syncedAt,
          },
        });
      },

      markSaved: () => set({ lastSaved: new Date() }),

      initialize: () => {
        // This will be called on the client to set proper online status
        if (typeof window !== "undefined") {
          set({ isOnline: navigator.onLine });
        }
      },
    }),
    {
      name: "budget-storage",
      storage: createJSONStorage(() => createPersistStorage()),
      skipHydration: true, // Important: Skip hydration for Zustand
    }
  )
);
