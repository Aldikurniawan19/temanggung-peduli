import { z } from "zod";

export const donationFormSchema = z.object({
  donorName: z
    .string()
    .min(2, { message: "Nama donatur minimal 2 karakter" })
    .max(100, { message: "Nama donatur maksimal 100 karakter" })
    .trim(),
  donorEmail: z
    .string()
    .email({ message: "Format email tidak valid. Masukkan format seperti nama@domain.com" })
    .optional()
    .or(z.literal("")),
  isAnonymous: z.boolean().default(false),
  amount: z
    .number({ message: "Nominal donasi harus berupa angka" })
    .int({ message: "Nominal donasi harus berupa bilangan bulat" })
    .min(10000, { message: "Nominal donasi minimal Rp 10.000" })
    .max(100000000, { message: "Nominal donasi maksimal Rp 100.000.000" }),
  message: z
    .string()
    .max(500, { message: "Pesan atau doa maksimal 500 karakter" })
    .trim()
    .optional()
    .or(z.literal("")),
});

export type DonationFormValues = z.infer<typeof donationFormSchema>;

export const prayerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama pengirim minimal 2 karakter" })
    .max(100, { message: "Nama pengirim maksimal 100 karakter" })
    .trim(),
  message: z
    .string()
    .min(5, { message: "Isi doa atau ucapan minimal 5 karakter" })
    .max(500, { message: "Isi doa atau ucapan maksimal 500 karakter" })
    .trim(),
});

export type PrayerFormValues = z.infer<typeof prayerFormSchema>;

export const documentationFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Judul kegiatan minimal 3 karakter" })
    .max(200, { message: "Judul kegiatan maksimal 200 karakter" })
    .trim(),
  description: z
    .string()
    .min(10, { message: "Deskripsi kegiatan minimal 10 karakter" })
    .max(2000, { message: "Deskripsi kegiatan maksimal 2000 karakter" })
    .trim(),
  type: z.enum(["galang_donasi", "penyaluran"], {
    message: "Tipe kegiatan harus dipilih antara galang donasi atau penyaluran",
  }),
  imageUrl: z
    .string()
    .min(1, { message: "Gambar kegiatan wajib diisi" })
    .refine(
      (val) =>
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("data:image/") ||
        val.startsWith("/"),
      { message: "Format gambar harus berupa URL atau data gambar yang valid" }
    ),
  eventDate: z.string().min(1, { message: "Tanggal kegiatan wajib diisi" }),
});

export type DocumentationFormValues = z.infer<typeof documentationFormSchema>;
