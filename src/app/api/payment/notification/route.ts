import { NextRequest, NextResponse } from "next/server";
import * as paymentService from "@/services/payment-service";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const result = await paymentService.handleMidtransWebhook(payload);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[API /api/payment/notification POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal memproses notifikasi webhook pembayaran.",
      },
      { status: 400 }
    );
  }
}
