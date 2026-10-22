import { NextRequest, NextResponse } from "next/server";
import { ADMIN_CONFIG, verifySessionToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_CONFIG.cookieName)?.value;
  const { valid, payload } = await verifySessionToken(token);

  if (!valid || !payload) {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: payload.sub,
      role: payload.role,
    },
  });
}
