import { NextResponse } from "next/server";
import { ADMIN_CONFIG } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Sesi admin telah diakhiri",
  });

  response.cookies.set({
    name: ADMIN_CONFIG.cookieName,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
