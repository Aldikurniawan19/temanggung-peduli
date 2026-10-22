import { NextRequest, NextResponse } from "next/server";
import * as docService from "@/services/dokumentasi-service";
import type { DocumentationType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const type =
      typeParam === "galang_donasi" || typeParam === "penyaluran"
        ? (typeParam as DocumentationType)
        : undefined;

    const documentations = await docService.getPublicDocumentations({
      type,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: documentations,
    });
  } catch (error) {
    console.error("[API /api/dokumentasi GET] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memuat galeri dokumentasi. Silakan muat ulang halaman.",
      },
      { status: 500 }
    );
  }
}
