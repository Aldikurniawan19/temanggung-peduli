import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prayerFormSchema } from "@/lib/validators";
import * as ucapanService from "@/services/ucapan-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const cursor = searchParams.get("cursor") || undefined;

    const prayers = await ucapanService.getPublicPrayers(limit, cursor);

    return NextResponse.json({
      success: true,
      data: prayers,
    });
  } catch (error) {
    console.error("[API /api/ucapan GET] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memuat doa dan ucapan. Silakan muat ulang halaman.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = prayerFormSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Data doa tidak valid";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
        },
        { status: 400 }
      );
    }

    const prayer = await ucapanService.submitPrayer(validationResult.data);

    try {
      revalidatePath("/ucapan");
      revalidatePath("/");
    } catch {
      // Revalidation fallback
    }

    return NextResponse.json(
      {
        success: true,
        data: prayer,
        message: "Doa dan ucapan berhasil dikirim dan tersimpan langsung.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /api/ucapan POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengirim doa dan ucapan. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
