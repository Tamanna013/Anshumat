import { NextRequest, NextResponse } from "next/server";

// Shared in-memory storage (same as sync route)
let budgets = new Map<string, any>();

// Default demo budget
const DEFAULT_BUDGET = {
  id: "default-budget",
  userId: "hire-me@anshumat.org",
  income: 50000,
  categories: {
    monthlyBills: 15000,
    food: 8000,
    transport: 5000,
    subscriptions: 2000,
    miscellaneous: 3000,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  syncedAt: new Date().toISOString(),
  syncStatus: "synced" as const,
};

export async function GET(request: NextRequest) {
  try {
    // Get userId from query params (in production, from auth)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "hire-me@anshumat.org";

    // Get budget from storage or return default
    let budget = budgets.get(userId);

    if (!budget) {
      // Return default for demo user
      if (userId === "hire-me@anshumat.org") {
        budget = DEFAULT_BUDGET;
        budgets.set(userId, budget);
      } else {
        return NextResponse.json(
          { error: "No budget found for user" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      budget,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get latest error:", error);
    return NextResponse.json(
      { error: "Failed to get latest budget" },
      { status: 500 }
    );
  }
}
