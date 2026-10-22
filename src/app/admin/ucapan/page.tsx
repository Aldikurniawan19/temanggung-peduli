"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquareCheck,
  Check,
  X,
  Trash2,
  Calendar,
  User,
  Search,
  Plus,
  CheckCheck,
  AlertTriangle,
  Heart,
} from "lucide-react";
import { formatDateTime } from "@/lib/formatter";
import { Button } from "@/components/ui/Button";

export default function AdminUcapanPage() {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal Tambah Doa Posko
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal Hapus Konfirmasi
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Batch Approval
  const [isBatchApproving, setIsBatchApproving] = useState(false);

  const fetchPrayers = async () => {
    try {
      setIsLoading(true);
      const statusQuery = filter === "all" ? "" : `&status=${filter}`;
      const res = await fetch(`/api/admin/ucapan?limit=200${statusQuery}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPrayers(json.data.prayers || []);
      }
    } catch (err) {
      console.error("Gagal memuat doa:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [filter]);

  const handleSetApproval = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch("/api/admin/ucapan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved }),
      });
      const json = await res.json();
      if (json.success) {
        setPrayers((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isApproved } : p))
        );
      }
    } catch (err) {
      console.error("Gagal memperbarui status doa:", err);
    }
  };

  const handleApproveAllPending = async () => {
    try {
      setIsBatchApproving(true);
      const res = await fetch("/api/admin/ucapan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_all_pending" }),
      });
      const json = await res.json();
      if (json.success) {
        setPrayers((prev) => prev.map((p) => ({ ...p, isApproved: true })));
      }
    } catch (err) {
      console.error("Gagal menyetujui seluruh doa:", err);
    } finally {
      setIsBatchApproving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/ucapan?id=${deleteTargetId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setPrayers((prev) => prev.filter((p) => p.id !== deleteTargetId));
        setDeleteTargetId(null);
      }
    } catch (err) {
      console.error("Gagal menghapus doa:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreatePrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (!newName.trim() || !newMessage.trim()) {
        throw new Error("Nama dan isi pesan wajib diisi");
      }

      const res = await fetch("/api/admin/ucapan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          message: newMessage.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menambahkan doa");
      }

      setShowAddModal(false);
      setNewName("");
      setNewMessage("");
      fetchPrayers();
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter & Search
  const filteredPrayers = prayers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "approved") return p.isApproved;
    if (filter === "pending") return !p.isApproved;
    return true;
  });

  const countPending = prayers.filter((p) => !p.isApproved).length;
  const countApproved = prayers.filter((p) => p.isApproved).length;

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Moderasi Doa & Ucapan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola dan tinjau pesan empati masyarakat Temanggung sebelum tampil di dinding publik.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {countPending > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleApproveAllPending}
              isLoading={isBatchApproving}
              leftIcon={<CheckCheck className="w-3.5 h-3.5 text-[#185334]" />}
            >
              Setujui Semua ({countPending})
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Tambah Pesan
          </Button>
        </div>
      </div>

      {/* 3 Kartu Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Doa Tersimpan
          </span>
          <div className="text-xl font-black text-slate-900">{prayers.length}</div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Seluruh catatan di database
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Sudah Terbit di Publik
          </span>
          <div className="text-xl font-black text-[#185334]">{countApproved}</div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Tampil di website publik
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-1 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Menunggu Tinjauan
          </span>
          <div className="text-xl font-black text-amber-600">{countPending}</div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Memerlukan persetujuan admin
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-[#185334] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua ({prayers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === "pending"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Menunggu Tinjauan ({countPending})
          </button>
          <button
            type="button"
            onClick={() => setFilter("approved")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === "approved"
                ? "bg-[#185334] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Sudah Terbit ({countApproved})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau isi pesan..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185334] transition-all font-medium"
          />
        </div>
      </div>

      {/* Daftar Kartu Doa */}
      <div className="space-y-3.5">
        {isLoading ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-14 text-center text-xs text-slate-400">
            Memuat data doa dari Supabase...
          </div>
        ) : filteredPrayers.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-14 text-center text-xs text-slate-400 space-y-1">
            <p className="font-bold text-slate-700">Tidak ada doa dalam status ini</p>
            <p>Pilih tab status lain atau ubah kata kunci pencarian.</p>
          </div>
        ) : (
          filteredPrayers.map((prayer) => (
            <div
              key={prayer.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#185334]" />
                    {prayer.name}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {formatDateTime(prayer.createdAt)}
                  </span>
                  {prayer.isApproved ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF5EF] text-[#185334] border border-[#185334]/20">
                      Disetujui
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                      Menunggu Moderasi
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{prayer.message}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                {!prayer.isApproved ? (
                  <button
                    type="button"
                    onClick={() => handleSetApproval(prayer.id, true)}
                    className="px-4 py-1.5 rounded-full bg-[#185334] hover:bg-[#124229] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetApproval(prayer.id, false)}
                    className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sembunyikan</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setDeleteTargetId(prayer.id)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Tambah Pesan Doa Baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                  Tambah Pesan / Doa Baru
                </h3>
                <p className="text-xs text-slate-500">
                  Pesan yang ditambahkan langsung aktif dan tampil di publik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePrayer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Warga / Relawan / Komunitas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Relawan Posko Temanggung Peduli"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Pesan & Doa <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tuliskan kata penyemangat atau doa untuk pejuang penembus kabut asap..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                  required
                />
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
                  Terbitkan Doa
                </Button>
              </div>
            </form>
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
                Hapus Doa Secara Permanen?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Doa akan dihapus langsung dari database Supabase.
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
                {isDeleting ? "Menghapus..." : "Ya, Hapus Doa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
