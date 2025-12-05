import { Budget } from "@/types/budget";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Demo user credentials (hard-coded as per requirements)
const DEMO_USER = {
  email: "hire-me@anshumat.org",
  password: "HireMe@2025!",
};

// Helper function to make API calls with error handling
async function apiFetch(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Don't throw for 404, just return null
      if (response.status === 404) {
        console.warn(`Endpoint not found: ${url}`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${url}:`, error);
    return null;
  }
}

export async function syncBudgetToServer(budget: Budget): Promise<{
  success: boolean;
  timestamp?: string;
  error?: string;
  budget?: Budget;
}> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/budget/sync`
    : "/api/budget/sync";

  const data = await apiFetch(url, {
    method: "POST",
    body: JSON.stringify(budget),
  });

  if (!data) {
    return {
      success: false,
      error: "Server unavailable",
    };
  }

  return data;
}

export async function getLatestBudgetFromServer(
  userId?: string
): Promise<Budget | null> {
  const url = API_BASE_URL
    ? `${API_BASE_URL}/api/budget/latest?userId=${userId || DEMO_USER.email}`
    : `/api/budget/latest?userId=${userId || DEMO_USER.email}`;

  const data = await apiFetch(url, {
    method: "GET",
  });

  if (!data || !data.success || !data.budget) {
    return null;
  }

  // Convert date strings back to Date objects
  const budget = data.budget;
  if (budget.createdAt) budget.createdAt = new Date(budget.createdAt);
  if (budget.updatedAt) budget.updatedAt = new Date(budget.updatedAt);
  if (budget.syncedAt) budget.syncedAt = new Date(budget.syncedAt);

  return budget as Budget;
}

export async function demoLogin(
  email: string,
  password: string
): Promise<{
  success: boolean;
  user?: { id: string; email: string; name: string };
  token?: string;
  error?: string;
}> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/auth/demo` : "/api/auth/demo";

  const data = await apiFetch(url, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!data) {
    return {
      success: false,
      error: "Server unavailable",
    };
  }

  if (data.success) {
    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  }

  return {
    success: false,
    error: data.error || "Login failed",
  };
}

// Check if server is available
export async function checkServerStatus(): Promise<boolean> {
  try {
    const url = API_BASE_URL ? `${API_BASE_URL}/api/health` : "/api/health";
    const response = await fetch(url, {
      method: "GET",
      // Add timeout
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const data = await response.json();
      return data.status === "ok";
    }
    return false;
  } catch (error) {
    console.log("Server status check failed:", error);
    return false;
  }
}

// Check if API endpoints exist
export async function checkApiEndpoints(): Promise<{
  health: boolean;
  auth: boolean;
  sync: boolean;
  latest: boolean;
}> {
  const base = API_BASE_URL || "";

  const [health, auth, sync, latest] = await Promise.all([
    apiFetch(`${base}/api/health`),
    apiFetch(`${base}/api/auth/demo`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
    apiFetch(`${base}/api/budget/sync`, {
      method: "POST",
      body: JSON.stringify({}),
    }),
    apiFetch(`${base}/api/budget/latest?userId=demo`),
  ]);

  return {
    health: health !== null,
    auth: auth !== null,
    sync: sync !== null,
    latest: latest !== null,
  };
}
