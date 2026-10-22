import { NextRequest, NextResponse } from "next/server";
import { uploadToSupabaseStorage } from "@/lib/supabase";
import fs from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
          error: "Ukuran file terlalu besar. Maksimal ukuran gambar adalah 5 MB.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Coba upload langsung ke Supabase Storage (Bucket: 'dokumentasi')
    const supabaseResult = await uploadToSupabaseStorage(
      buffer,
      file.name,
      file.type,
      "dokumentasi"
    );

    if (supabaseResult.url && !supabaseResult.error) {
      return NextResponse.json({
        success: true,
        data: {
          url: supabaseResult.url,
          storage: "supabase",
          path: supabaseResult.path,
        },
      });
    }

    // 2. Fallback: Jika Supabase bucket belum disetup / key anon belum diinput,
    // simpan ke public/uploads agar alur admin tetap berjalan mulus
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const cleanExt = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        storage: "local-fallback",
        note: supabaseResult.error
          ? `Disimpan sementara ke lokal karena: ${supabaseResult.error}`
          : undefined,
      },
    });
  } catch (error: any) {
    console.error("[API /api/upload POST] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Gagal mengunggah gambar. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}
