import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import * as donasiService from "@/services/donasi-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const cursor = searchParams.get("cursor") || undefined;

    const [donations, stats] = await Promise.all([
      donasiService.getPublicDonations(limit, cursor),
      donasiService.getDonationSummaryStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        donations,
        stats,
      },
    });
  } catch (error) {
    console.error("[API /api/donasi GET] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memuat data donasi. Silakan muat ulang halaman.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donationFormSchema } = await import("@/lib/validators");
    const validationResult = donationFormSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Data formulir donasi tidak valid";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
        },
        { status: 400 }
      );
    }

    const result = await donasiService.createDirectDonation(validationResult.data);

    try {
      revalidatePath("/");
      revalidatePath("/donasi");
      revalidatePath("/admin/donasi");
      revalidatePath("/admin");
    } catch {
      // Revalidation fallback
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          donationId: result.donation.id,
          orderId: result.transaction.orderId,
          amount: result.donation.amount,
          donorName: result.donation.donorName,
          status: "settlement",
          isVerified: true,
        },
        message: "Donasi berhasil disimpan dan terverifikasi langsung ke database Supabase.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API /api/donasi POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal menyimpan donasi ke database Supabase.",
      },
      { status: 500 }
    );
  }
}

