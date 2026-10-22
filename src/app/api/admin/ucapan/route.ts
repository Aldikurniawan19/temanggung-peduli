import { NextRequest, NextResponse } from "next/server";
import * as ucapanService from "@/services/ucapan-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const statusParam = searchParams.get("status");

    const isApproved =
      statusParam === "approved" ? true : statusParam === "pending" ? false : undefined;

    const data = await ucapanService.getAdminPrayerList(limit, offset, isApproved);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[API /api/admin/ucapan GET] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data doa untuk admin" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isApproved, action } = body;

    if (action === "approve_all_pending") {
      const result = await ucapanService.approveAllPendingPrayers();
      return NextResponse.json({
        success: true,
        data: result,
        message: `${result.count} doa yang menunggu berhasil disetujui sekaligus`,
      });
    }

    if (!id || typeof isApproved !== "boolean") {
      return NextResponse.json(
        { success: false, error: "ID dan status persetujuan wajib disertakan" },
        { status: 400 }
      );
    }

    const updated = await ucapanService.setPrayerStatus(id, isApproved);

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Doa berhasil ${isApproved ? "disetujui" : "dibatalkan"}`,
    });
  } catch (error) {
    console.error("[API /api/admin/ucapan PATCH] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status doa" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prayerFormSchema } = await import("@/lib/validators");
    const validation = prayerFormSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Data doa tidak valid";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const created = await ucapanService.submitPrayer(validation.data);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: "Doa dan pesan berhasil ditambahkan",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API /api/admin/ucapan POST] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal menambahkan doa" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID doa wajib disertakan" },
        { status: 400 }
      );
    }

    await ucapanService.deletePrayerById(id);

    return NextResponse.json({
      success: true,
      message: "Doa berhasil dihapus",
    });
  } catch (error) {
    console.error("[API /api/admin/ucapan DELETE] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus doa" },
      { status: 500 }
    );
  }
}
