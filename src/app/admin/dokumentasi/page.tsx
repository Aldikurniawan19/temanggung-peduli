"use client";

import React, { useEffect, useState } from "react";
import { Camera, Plus, Trash2, Calendar, Tag, Image as ImageIcon } from "lucide-react";
import { formatDate } from "@/lib/formatter";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { documentationFormSchema } from "@/lib/validators";

export default function AdminDokumentasiPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"galang_donasi" | "penyaluran">("penyaluran");
  const [imageUrl, setImageUrl] = useState("");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengunggah gambar ke Supabase");
      }

      setImageUrl(json.data.url);
      if (errors.imageUrl) {
        setErrors((prev) => ({ ...prev, imageUrl: "" }));
      }
    } catch (err: any) {
      setUploadError(err.message || "Gagal mengunggah gambar");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dokumentasi?limit=100");
      const json = await res.json();
      if (json.success && json.data) {
        setItems(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat dokumentasi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = documentationFormSchema.safeParse({
      title: title.trim(),
      description: description.trim(),
      type,
      imageUrl: imageUrl.trim(),
      eventDate,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const fieldName = err.path[0]?.toString() || "form";
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/dokumentasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan dokumentasi");
      }

      setShowAddForm(false);
      setTitle("");
      setDescription("");
      setImageUrl("");
      fetchItems();
    } catch (err: any) {
      setErrors({ form: err.message || "Terjadi kesalahan saat menambah dokumentasi" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus dokumentasi ini?")) return;

    try {
      const res = await fetch(`/api/admin/dokumentasi?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Kelola Galeri Dokumentasi
          </h1>
          <p className="text-sm text-[var(--color-secondary)] mt-0.5">
            Unggah dan perbarui arsip foto aksi lapangan penggalangan dana dan penyaluran bantuan.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {showAddForm ? "Tutup Formulir" : "Tambah Dokumentasi"}
        </Button>
      </div>

      {/* Form Tambah Dokumentasi */}
      {showAddForm && (
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-base text-[var(--color-foreground)] flex items-center gap-2">
            <Camera className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Formulir Dokumentasi Baru</span>
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">
            {errors.form && (
              <div className="p-3 rounded-lg bg-[var(--color-danger-light)] text-[var(--color-danger)] text-xs font-medium">
                {errors.form}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Judul Kegiatan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Penyerahan 100 Masker N95 di Posko"
                error={errors.title}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[var(--color-foreground)]">
                  Kategori Aksi <span className="text-[var(--color-danger)]">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="penyaluran">Penyaluran Bantuan Lapangan</option>
                  <option value="galang_donasi">Aksi Penggalangan Dana</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File Upload Langsung ke Supabase Storage */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-foreground)]">
                  Unggah Foto Kegiatan (Supabase Storage) <span className="text-[var(--color-danger)]">*</span>
                </label>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative flex-1 w-full">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 text-sm font-medium cursor-pointer transition-colors w-full ${
                        isUploading
                          ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                          : "border-slate-300 hover:border-[#185334] hover:bg-[#EBF5EF]/30 text-slate-700"
                      }`}
                    >
                      <Camera className="w-4 h-4 text-[#185334]" />
                      <span>{isUploading ? "Mengunggah ke Supabase..." : "Pilih File Gambar dari Komputer"}</span>
                    </label>
                  </div>

                  {imageUrl && (
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                      <img src={imageUrl} alt="Pratinjau" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {uploadError && (
                  <p className="text-xs text-[var(--color-danger)] font-medium mt-1">
                    {uploadError}
                  </p>
                )}
              </div>

              <Input
                label="Atau Masukkan URL Gambar Manual"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... URL tautan gambar"
                leftAddon={<ImageIcon className="w-4 h-4" />}
                error={errors.imageUrl}
                required
              />

              <Input
                label="Tanggal Kegiatan"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                error={errors.eventDate}
                required
              />
            </div>

            <Textarea
              label="Deskripsi Detail Kegiatan"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail personil yang terlibat, jumlah bantuan tersalurkan, atau lokasi kegiatan..."
              error={errors.description}
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowAddForm(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
              >
                Simpan Dokumentasi
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Grid Dokumentasi Tersimpan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full bg-white border border-[var(--color-border)] rounded-2xl p-12 text-center text-sm text-[var(--color-secondary)]">
            Memuat dokumentasi...
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full bg-white border border-[var(--color-border)] rounded-2xl p-12 text-center text-sm text-[var(--color-secondary)]">
            Belum ada data dokumentasi.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={item.type === "galang_donasi" ? "warning" : "primary"}>
                      {item.type === "galang_donasi" ? "Galang Dana" : "Penyaluran"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-secondary)]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(item.eventDate)}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[var(--color-foreground)] line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[var(--color-secondary)] line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex justify-end border-t border-gray-50 mt-2">
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
