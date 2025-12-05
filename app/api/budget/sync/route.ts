import { NextRequest, NextResponse } from "next/server";
import { Budget } from "@/types/budget";

// In-memory storage for demo (in production, use a database)
let budgets = new Map<string, Budget>();

// Helper function to validate budget data
function validateBudget(data: any): Budget | null {
  try {
    const budget: Budget = {
      id: data.id || `budget-${Date.now()}`,
      userId: data.userId || "unknown",
      income: Number(data.income) || 0,
      categories: {
        monthlyBills: Number(data.categories?.monthlyBills) || 0,
        food: Number(data.categories?.food) || 0,
        transport: Number(data.categories?.transport) || 0,
        subscriptions: Number(data.categories?.subscriptions) || 0,
        miscellaneous: Number(data.categories?.miscellaneous) || 0,
      },
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: new Date(),
      syncedAt: new Date(),
      syncStatus: "synced",
    };

    return budget;
  } catch (error) {
    console.error("Validation error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const budget = validateBudget(body);

    if (!budget) {
      return NextResponse.json(
        { error: "Invalid budget data" },
        { status: 400 }
      );
    }

    // Store budget (keyed by userId for demo)
    budgets.set(budget.userId, budget);

    console.log("Budget synced:", budget.id);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      budget: {
        ...budget,
        // Don't send back the full object in production
        id: budget.id,
        syncedAt: budget.syncedAt,
      },
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync budget" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get userId from query params (in production, get from auth)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "hire-me@anshumat.org";

    const budget = budgets.get(userId);

    if (!budget) {
      return NextResponse.json({ error: "No budget found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      budget: {
        ...budget,
        syncedAt: budget.syncedAt,
      },
    });
  } catch (error) {
    console.error("Get budget error:", error);
    return NextResponse.json(
      { error: "Failed to get budget" },
      { status: 500 }
    );
  }
}
