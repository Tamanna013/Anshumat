"use client";

import { useEffect } from "react";
import {
  DollarSign,
  Home,
  Utensils,
  Car,
  Tv,
  ShoppingBag,
  Save,
} from "lucide-react";
import { useBudgetStore } from "@/lib/store/budgetStoreSimple";
import { BudgetInput } from "./BudgetInput";

// Category configuration with icons and colors
const categories = [
  {
    id: "income",
    name: "Monthly Income",
    key: "income" as const,
    icon: DollarSign,
    color: "from-yellow-500 to-amber-500",
    description: "Your total monthly income after taxes",
    placeholder: "50000",
  },
  {
    id: "monthlyBills",
    name: "Monthly Bills",
    key: "monthlyBills" as const,
    icon: Home,
    color: "from-blue-500 to-cyan-500",
    description: "Rent, EMI, utilities, insurance",
    placeholder: "15000",
  },
  {
    id: "food",
    name: "Food & Dining",
    key: "food" as const,
    icon: Utensils,
    color: "from-green-500 to-emerald-500",
    description: "Groceries, restaurants, food delivery",
    placeholder: "8000",
  },
  {
    id: "transport",
    name: "Transport",
    key: "transport" as const,
    icon: Car,
    color: "from-red-500 to-pink-500",
    description: "Fuel, public transport, cabs, maintenance",
    placeholder: "5000",
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    key: "subscriptions" as const,
    icon: Tv,
    color: "from-purple-500 to-violet-500",
    description: "OTT, SaaS, apps, memberships",
    placeholder: "2000",
  },
  {
    id: "miscellaneous",
    name: "Miscellaneous",
    key: "miscellaneous" as const,
    icon: ShoppingBag,
    color: "from-gray-500 to-slate-500",
    description: "Shopping, entertainment, personal care",
    placeholder: "3000",
  },
];

// Safe default budget
const DEFAULT_BUDGET = {
  id: "default",
  userId: "default",
  income: 0,
  categories: {
    monthlyBills: 0,
    food: 0,
    transport: 0,
    subscriptions: 0,
    miscellaneous: 0,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  syncStatus: "local" as const,
};

export function BudgetForm() {
  const budget = useBudgetStore((state) => state.budget);
  const updateIncome = useBudgetStore((state) => state.updateIncome);
  const updateCategory = useBudgetStore((state) => state.updateCategory);

  // Initialize budget if none exists
  useEffect(() => {
    if (!budget || !budget.categories) {
      useBudgetStore.getState().setBudget(DEFAULT_BUDGET);
    }
  }, [budget]);

  // Safe budget with defaults
  const safeBudget = budget && budget.categories ? budget : DEFAULT_BUDGET;

  // Safe categories with defaults
  const safeCategories = safeBudget.categories || DEFAULT_BUDGET.categories;

  const handleIncomeChange = (value: number) => {
    updateIncome(value);
  };

  const handleCategoryChange = (
    category: keyof typeof safeCategories,
    value: number
  ) => {
    updateCategory(category, value);
  };

  // Calculate totals with null safety
  const totalExpenses = safeCategories
    ? Object.values(safeCategories).reduce((a, b) => a + b, 0)
    : 0;

  const income = safeBudget.income || 0;
  const savings = income - totalExpenses;
  const burnRate = income > 0 ? (totalExpenses / income) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
          BudgetBox
        </h1>
        <p className="text-gray-400">
          Offline-first budgeting with auto-save. Every keystroke is saved
          locally.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-400">
                ₹{income.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500/50" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-red-500/50" />
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Savings</p>
              <p
                className={`text-2xl font-bold ${
                  savings >= 0 ? "text-blue-400" : "text-red-400"
                }`}
              >
                ₹{savings.toLocaleString()}
              </p>
            </div>
            <Save className="w-8 h-8 text-blue-500/50" />
          </div>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20`}
            >
              <DollarSign className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Monthly Income
              </h3>
              <p className="text-sm text-gray-400">
                Your take-home pay after taxes
              </p>
            </div>
          </div>

          <BudgetInput
            value={income}
            onChange={handleIncomeChange}
            placeholder="Enter your monthly income"
            prefix="₹"
          />

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Burn Rate:</span>
              <span
                className={burnRate > 100 ? "text-red-400" : "text-green-400"}
              >
                {burnRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Savings Potential:</span>
              <span className={savings >= 0 ? "text-blue-400" : "text-red-400"}>
                ₹{savings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Expense Categories */}
        <div className="space-y-4">
          {categories.slice(1).map((category) => (
            <div key={category.id} className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${category.color}/20`}
                  >
                    <category.icon
                      className={`w-5 h-5 ${category.color
                        .split(" ")[0]
                        .replace("from-", "text-")}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{category.name}</h4>
                    <p className="text-xs text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-white">
                    ₹{(safeCategories[category.key] || 0).toLocaleString()}
                  </p>
                  {income > 0 && (
                    <p className="text-xs text-gray-400">
                      {(
                        ((safeCategories[category.key] || 0) / income) *
                        100
                      ).toFixed(1)}
                      % of income
                    </p>
                  )}
                </div>
              </div>

              <BudgetInput
                value={safeCategories[category.key] || 0}
                onChange={(value) => handleCategoryChange(category.key, value)}
                placeholder={`Enter ${category.name.toLowerCase()} amount`}
                prefix="₹"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
