import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_CONFIG, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_CONFIG.cookieName)?.value;

  // Rute API Auth dikecualikan dari pengecekan agar login/logout tetap bisa dipanggil
  if (pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  const { valid } = await verifySessionToken(token);

  // Jika membuka halaman login
  if (pathname === "/admin/login") {
    // Jika sudah login, redirect langsung ke dashboard admin
    if (valid) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Jika memanggil endpoint API admin selain auth
  if (pathname.startsWith("/api/admin")) {
    if (!valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Akses ditolak. Silakan login sebagai admin terlebih dahulu.",
        },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Jika mengakses halaman dashboard admin (/admin, /admin/donasi, dll.)
  if (pathname.startsWith("/admin")) {
    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      // Simpan rute tujuan agar setelah login otomatis dialihkan kembali
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
