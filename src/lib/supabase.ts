import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ttirwzgsinzplacpoglp.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "";

/**
 * Public Supabase Client for client-side and browser interactions
 */
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Server-side / Admin Supabase Client using Service Role Key
 */
export function getSupabaseAdmin() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  return createClient(supabaseUrl, serviceKey || "placeholder-key", {
    auth: {
      persistSession: false,
    },
  });
}

export interface UploadResult {
  url: string | null;
  path: string | null;
  error: string | null;
}

/**
 * Helper to upload files directly to Supabase Storage Bucket
 * Defaults to 'dokumentasi' bucket
 */
export async function uploadToSupabaseStorage(
  fileBuffer: Buffer | Blob | Uint8Array,
  fileName: string,
  contentType: string,
  bucketName = "dokumentasi"
): Promise<UploadResult> {
  try {
    const admin = getSupabaseAdmin();
    const cleanExt = fileName.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const storagePath = `public/${timestamp}-${random}.${cleanExt}`;

    // Upload to Supabase Storage
    const { data, error } = await admin.storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { url: null, path: null, error: error.message };
    }

    // Get public accessible URL
    const { data: publicData } = admin.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return {
      url: publicData.publicUrl,
      path: data.path,
      error: null,
    };
  } catch (err: any) {
    return {
      url: null,
      path: null,
      error: err.message || "Gagal mengunggah file ke Supabase Storage",
    };
  }
}
