import { NextRequest, NextResponse } from "next/server";
import * as donasiRepo from "@/repositories/donasi-repository";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const data = await donasiRepo.getAllDonationsForAdmin(limit, offset);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[API /api/admin/donasi GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data donasi admin" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isVerified } = body;

    if (!id || typeof isVerified !== "boolean") {
      return NextResponse.json(
        { success: false, error: "ID donasi dan status verifikasi wajib disertakan" },
        { status: 400 }
      );
    }

    const updated = await donasiRepo.markDonationVerified(id, isVerified);

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Donasi berhasil ${isVerified ? "diverifikasi" : "dibatalkan verifikasinya"}`,
    });
  } catch (error) {
    console.error("[API /api/admin/donasi PATCH] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui verifikasi donasi" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donationFormSchema } = await import("@/lib/validators");
    const validation = donationFormSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Data donasi tidak valid";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderId = `MANUAL-${Date.now()}-${randomSuffix}`;

    const result = await donasiRepo.createDirectVerifiedDonation({
      donation: validation.data,
      orderId,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Donasi manual berhasil dicatat dan diverifikasi di Supabase",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API /api/admin/donasi POST] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mencatat donasi manual" },
      { status: 500 }
    );
  }
}

