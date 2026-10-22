"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Plus,
  Trash2,
  Calendar,
  Search,
  Upload,
  X,
  Eye,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { formatDate } from "@/lib/formatter";
import { Button } from "@/components/ui/Button";
import { documentationFormSchema } from "@/lib/validators";

export default function AdminDokumentasiPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "penyaluran" | "galang_donasi">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"galang_donasi" | "penyaluran">("penyaluran");
  const [imageUrl, setImageUrl] = useState("");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Lightbox Modal
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Delete Modal
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const compressImage = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new window.Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
          const compressedDataUrl = canvas.toDataURL(outputType, quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error("Format file gambar tidak dapat diproses"));
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Gagal membaca file dari komputer"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Kompresi gambar langsung di browser agar resolusi tajam dan hemat memori (< 200 KB)
      const compressedDataUrl = await compressImage(file, 1200, 0.82);

      // 2. Simpan string Data URL langsung ke state form (tersimpan langsung ke tabel database Supabase)
      setImageUrl(compressedDataUrl);
      if (errors.imageUrl) {
        setErrors((prev) => ({ ...prev, imageUrl: "" }));
      }
    } catch (err: any) {
      setUploadError(err.message || "Gagal memproses gambar");
    } finally {
      setIsUploading(false);
    }
  };

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

      setShowAddModal(false);
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

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/dokumentasi?id=${deleteTargetId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
        setDeleteTargetId(null);
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter === "all") return true;
    return item.type === categoryFilter;
  });

  const countPenyaluran = items.filter((i) => i.type === "penyaluran").length;
  const countGalang = items.filter((i) => i.type === "galang_donasi").length;

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola Galeri Dokumentasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Unggah foto aksi relawan posko dan arsip penyaluran logistik langsung ke Supabase Storage.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Unggah Dokumentasi Baru
        </Button>
      </div>

      {/* 3 Kartu Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Arsip Dokumentasi
          </span>
          <div className="text-xl font-black text-slate-900">{items.length}</div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Foto kegiatan lapangan tersimpan
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Aksi Penyaluran Logistik
          </span>
          <div className="text-xl font-black text-[#185334]">{countPenyaluran}</div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Distribusi masker, oksigen & posko
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Penggalangan Dana
          </span>
          <div className="text-xl font-black text-amber-600">{countGalang}</div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Aksi posko kemanusiaan Temanggung
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              categoryFilter === "all"
                ? "bg-[#185334] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("penyaluran")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              categoryFilter === "penyaluran"
                ? "bg-[#185334] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Penyaluran Bantuan ({countPenyaluran})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter("galang_donasi")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              categoryFilter === "galang_donasi"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Galang Dana ({countGalang})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul atau aksi..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185334] transition-all font-medium"
          />
        </div>
      </div>

      {/* Grid Galeri Dokumentasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full bg-white border border-slate-200/80 rounded-2xl p-14 text-center text-xs text-slate-400">
            Memuat arsip galeri dari Supabase...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200/80 rounded-2xl p-14 text-center text-xs text-slate-400 space-y-1">
            <p className="font-bold text-slate-700">Tidak ada dokumentasi yang sesuai</p>
            <p>Pilih kategori lain atau tambahkan dokumentasi baru.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group"
            >
              <div>
                {/* Image Aspect Box */}
                <div
                  className="relative aspect-16/10 w-full bg-slate-100 cursor-pointer overflow-hidden"
                  onClick={() => setPreviewImage({ url: item.imageUrl, title: item.title })}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                        item.type === "galang_donasi"
                          ? "bg-amber-500 text-white"
                          : "bg-[#185334] text-white"
                      }`}
                    >
                      {item.type === "galang_donasi" ? "Galang Dana" : "Penyaluran"}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/60 text-white p-1 rounded-lg">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3 text-[#185334]" />
                    <span>{formatDate(item.eventDate)}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-[#185334] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 pt-0 flex justify-end border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(item.id)}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-1 hover:bg-red-50 rounded-full transition-colors border border-red-100/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Tambah Dokumentasi Baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                  Unggah Dokumentasi Baru
                </h3>
                <p className="text-xs text-slate-500">
                  Foto akan disimpan langsung di Supabase Storage bucket dokumentasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errors.form && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Kegiatan Aksi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Penyerahan 100 Masker N95 di Posko"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                  required
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori Aksi <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                  >
                    <option value="penyaluran">Penyaluran Bantuan Lapangan</option>
                    <option value="galang_donasi">Aksi Penggalangan Dana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tanggal Kegiatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                    required
                  />
                </div>
              </div>

              {/* Unggah File Supabase Storage */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Unggah Gambar / Foto <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      id="doc-file-upload"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="doc-file-upload"
                      className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 text-xs sm:text-sm font-semibold cursor-pointer transition-colors w-full ${
                        isUploading
                          ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                          : "border-slate-300 hover:border-[#185334] hover:bg-[#EBF5EF]/30 text-slate-700"
                      }`}
                    >
                      <Upload className="w-4 h-4 text-[#185334]" />
                      <span>
                        {isUploading
                          ? "Memproses gambar..."
                          : "Pilih File Foto (Disimpan ke Tabel Database)"}
                      </span>
                    </label>
                  </div>

                  {imageUrl && (
                    <div className="relative w-16 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <img src={imageUrl} alt="Pratinjau" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {uploadError && (
                  <p className="text-xs text-red-500 font-medium">{uploadError}</p>
                )}

                {/* Input URL Manual Fallback */}
                <div className="pt-1">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Atau tautan URL gambar (https://...)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                    required
                  />
                  {errors.imageUrl && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.imageUrl}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Kegiatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail lokasi posko, personil yang terlibat, jumlah paket sembako/masker..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                  required
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.description}</p>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowAddModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                >
                  Simpan & Terbitkan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lightbox Preview Foto */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl space-y-3 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900 line-clamp-1">
                {previewImage.title}
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTargetId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">
                Hapus Dokumentasi Aksi?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Foto dan keterangan kegiatan akan dihapus dari arsip database.
              </p>
            </div>

            <div className="flex justify-center gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTargetId(null)}
              >
                Batal
              </Button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
