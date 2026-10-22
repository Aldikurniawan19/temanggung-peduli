import { NextRequest, NextResponse } from "next/server";
import { documentationFormSchema } from "@/lib/validators";
import * as docService from "@/services/dokumentasi-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = documentationFormSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Data dokumentasi tidak valid";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const created = await docService.createDocumentationItem(validationResult.data);

    return NextResponse.json(
      {
        success: true,
        data: created,
        message: "Dokumentasi kegiatan berhasil ditambahkan",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /api/admin/dokumentasi POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan data dokumentasi" },
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
        { success: false, error: "ID dokumentasi wajib disertakan" },
        { status: 400 }
      );
    }

    await docService.deleteDocumentationItem(id);

    return NextResponse.json({
      success: true,
      message: "Dokumentasi berhasil dihapus",
    });
  } catch (error) {
    console.error("[API /api/admin/dokumentasi DELETE] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus dokumentasi" },
      { status: 500 }
    );
  }
}
