import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "BudgetBox API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth/demo",
      sync: "/api/budget/sync",
      latest: "/api/budget/latest",
      health: "/api/health",
    },
  });
}
