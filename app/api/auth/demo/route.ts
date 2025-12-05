import { NextRequest, NextResponse } from "next/server";

// Demo user credentials (hard-coded as per requirements)
const DEMO_USER = {
  email: "hire-me@anshumat.org",
  password: "HireMe@2025!",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      return NextResponse.json({
        success: true,
        user: {
          id: "demo-user-1",
          email: DEMO_USER.email,
          name: "Demo User",
        },
        token: "demo-token-123456", // Simple token for demo
      });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
