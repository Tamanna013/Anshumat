"use client";

import { useBudgetStore } from "@/lib/store/budgetStoreSimple";

export default function DebugPage() {
  const budget = useBudgetStore((state) => state.budget);

  console.log("Budget debug:", budget);
  console.log("Categories:", budget?.categories);
  console.log("Categories type:", typeof budget?.categories);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Debug Page</h1>
      <pre className="bg-gray-800 p-4 rounded mt-4">
        {JSON.stringify(
          {
            budgetExists: !!budget,
            budgetType: typeof budget,
            categoriesExist: !!budget?.categories,
            categoriesType: typeof budget?.categories,
            budget: budget,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
