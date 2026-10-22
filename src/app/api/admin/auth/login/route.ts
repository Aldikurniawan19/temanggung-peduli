import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_CONFIG,
  createSessionToken,
  verifyAdminCredentials,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username dan kata sandi wajib diisi",
        },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Username atau kata sandi tidak cocok",
        },
        { status: 401 }
      );
    }

    const token = await createSessionToken(username.trim());

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil, mengalihkan ke dashboard...",
      user: {
        username: username.trim(),
        role: "admin",
      },
    });

    response.cookies.set({
      name: ADMIN_CONFIG.cookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_CONFIG.maxAgeSeconds,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
