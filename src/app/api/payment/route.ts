import { NextRequest, NextResponse } from "next/server";
import { donationFormSchema } from "@/lib/validators";
import * as paymentService from "@/services/payment-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = donationFormSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Data formulir tidak valid";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
        },
        { status: 400 }
      );
    }

    const snapResult = await paymentService.initiateDonationPayment(
      validationResult.data
    );

    return NextResponse.json(
      {
        success: true,
        data: snapResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /api/payment POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses inisiasi pembayaran donasi. Silakan periksa kembali formulir atau coba lagi sesaat lagi.",
      },
      { status: 500 }
    );
  }
}
