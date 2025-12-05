export type BudgetCategory = {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: string;
};

export type Budget = {
  id: string;
  userId: string;
  income: number;
  categories: {
    monthlyBills: number;
    food: number;
    transport: number;
    subscriptions: number;
    miscellaneous: number;
  };
  createdAt: Date;
  updatedAt: Date;
  syncedAt?: Date;
  syncStatus: "local" | "pending" | "synced";
};

export type SyncStatus = "local" | "pending" | "synced";
