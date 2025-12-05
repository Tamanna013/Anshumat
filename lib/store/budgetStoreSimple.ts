"use client";

import { create } from "zustand";
import { Budget } from "@/types/budget";

// Default budget with all required fields
const defaultBudget: Budget = {
  id: "budget-1",
  userId: "hire-me@anshumat.org",
  income: 50000,
  categories: {
    monthlyBills: 15000,
    food: 8000,
    transport: 5000,
    subscriptions: 2000,
    miscellaneous: 3000,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  syncStatus: "local",
};

// Function to validate and fix budget structure
const validateBudget = (budget: any): Budget => {
  if (!budget || typeof budget !== "object") {
    return defaultBudget;
  }

  return {
    id: budget.id || defaultBudget.id,
    userId: budget.userId || defaultBudget.userId,
    income:
      typeof budget.income === "number" ? budget.income : defaultBudget.income,
    categories: {
      monthlyBills:
        typeof budget.categories?.monthlyBills === "number"
          ? budget.categories.monthlyBills
          : defaultBudget.categories.monthlyBills,
      food:
        typeof budget.categories?.food === "number"
          ? budget.categories.food
          : defaultBudget.categories.food,
      transport:
        typeof budget.categories?.transport === "number"
          ? budget.categories.transport
          : defaultBudget.categories.transport,
      subscriptions:
        typeof budget.categories?.subscriptions === "number"
          ? budget.categories.subscriptions
          : defaultBudget.categories.subscriptions,
      miscellaneous:
        typeof budget.categories?.miscellaneous === "number"
          ? budget.categories.miscellaneous
          : defaultBudget.categories.miscellaneous,
    },
    createdAt: budget.createdAt
      ? new Date(budget.createdAt)
      : defaultBudget.createdAt,
    updatedAt: budget.updatedAt
      ? new Date(budget.updatedAt)
      : defaultBudget.updatedAt,
    syncedAt: budget.syncedAt ? new Date(budget.syncedAt) : undefined,
    syncStatus: budget.syncStatus || defaultBudget.syncStatus,
  };
};

interface BudgetState {
  budget: Budget;
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
}

// Create store with client-side only initialization
export const useBudgetStore = create<BudgetState>((set, get) => {
  // This runs on both server and client initially, but we'll handle it
  let initialBudget = defaultBudget;
  let isOnline = true;

  // Only access browser APIs on client
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("budget-storage");
      if (saved) {
        const parsed = JSON.parse(saved);
        initialBudget = validateBudget(parsed);
      }
    } catch (error) {
      console.error("Error loading budget from localStorage:", error);
    }
    isOnline = navigator.onLine;
  }

  return {
    budget: initialBudget,
    isOnline,
    syncStatus: "local",
    lastSaved: null,

    setBudget: (budget) => {
      const validated = validateBudget(budget);
      set({ budget: validated });
      if (typeof window !== "undefined") {
        localStorage.setItem("budget-storage", JSON.stringify(validated));
      }
    },

    updateCategory: (category, value) => {
      const current = get().budget;
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

      if (typeof window !== "undefined") {
        localStorage.setItem("budget-storage", JSON.stringify(updated));
      }
    },

    updateIncome: (income) => {
      const current = get().budget;
      const updated = {
        ...current,
        income,
        updatedAt: new Date(),
        syncStatus: "pending" as const,
      };

      set({ budget: updated });
      get().markSaved();

      if (typeof window !== "undefined") {
        localStorage.setItem("budget-storage", JSON.stringify(updated));
      }
    },

    setOnlineStatus: (isOnline) => set({ isOnline }),

    setSyncStatus: (status) => {
      const current = get().budget;
      const updated = {
        ...current,
        syncStatus: status,
        syncedAt: status === "synced" ? new Date() : current.syncedAt,
      };

      set({
        syncStatus: status,
        budget: updated,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("budget-storage", JSON.stringify(updated));
      }
    },

    markSaved: () => set({ lastSaved: new Date() }),
  };
});

// Set up network listeners (client-side only)
if (typeof window !== "undefined") {
  const handleOnline = () => useBudgetStore.getState().setOnlineStatus(true);
  const handleOffline = () => useBudgetStore.getState().setOnlineStatus(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
}
