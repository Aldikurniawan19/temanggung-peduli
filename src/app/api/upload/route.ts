import { NextRequest, NextResponse } from "next/server";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan dalam request." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format file tidak didukung. Harap unggah gambar JPG, PNG, atau WEBP.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Ukuran file terlalu besar. Maksimal ukuran gambar adalah 10 MB.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Konversi buffer gambar langsung ke Base64 Data URL
    // Gambar disimpan langsung ke tabel database Supabase (bukan ke filesystem project)
    const mimeType = file.type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      data: {
        url: dataUrl,
        storage: "database-table",
        size: file.size,
      },
    });
  } catch (error: any) {
    console.error("[API /api/upload POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal memproses gambar. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
