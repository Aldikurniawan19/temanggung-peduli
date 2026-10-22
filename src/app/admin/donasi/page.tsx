"use client";

import React, { useEffect, useState } from "react";
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  Search,
  ShieldCheck,
  Download,
  Plus,
  X,
  Eye,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import { formatRupiah, formatDateTime } from "@/lib/formatter";
import { Button } from "@/components/ui/Button";

export default function AdminDonasiPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "pending" | "anonymous">("all");

  // Modal Detail Transaksi
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);

  // Modal Donasi Manual
  const [showAddModal, setShowAddModal] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("100000");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/donasi?limit=200");
      const json = await res.json();
      if (json.success && json.data) {
        setDonations(json.data.donations || []);
      }
    } catch (err) {
      console.error("Gagal memuat donasi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/donasi", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVerified: !currentStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setDonations((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isVerified: !currentStatus } : d))
        );
        if (selectedDonation && selectedDonation.id === id) {
          setSelectedDonation((prev: any) => ({ ...prev, isVerified: !currentStatus }));
        }
      }
    } catch (err) {
      console.error("Gagal update verifikasi:", err);
    }
  };

  const handleCreateManualDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    try {
      const numAmount = parseInt(amount.replace(/\D/g, "") || "0", 10);
      if (numAmount < 10000) {
        throw new Error("Nominal donasi minimal Rp 10.000");
      }

      const res = await fetch("/api/admin/donasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donorName.trim() || (isAnonymous ? "Hamba Allah" : "Donatur Posko"),
          donorEmail: donorEmail.trim() || undefined,
          amount: numAmount,
          message: message.trim() || undefined,
          isAnonymous,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mencatat donasi manual");
      }

      setShowAddModal(false);
      setDonorName("");
      setDonorEmail("");
      setMessage("");
      setAmount("100000");
      setIsAnonymous(false);
      fetchDonations();
    } catch (err: any) {
      setModalError(err.message || "Terjadi kendala saat menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ekspor ke CSV
  const handleExportCSV = () => {
    if (donations.length === 0) return;

    const headers = [
      "Order ID",
      "Nama Donatur",
      "Email",
      "Nominal (Rp)",
      "Opsi Publik",
      "Status",
      "Metode Pembayaran",
      "Tanggal",
      "Pesan",
    ];

    const rows = filteredDonations.map((d) => [
      d.transaction?.orderId || "-",
      `"${d.donorName.replace(/"/g, '""')}"`,
      d.donorEmail || "-",
      d.amount,
      d.isAnonymous ? "Anonim (Hamba Allah)" : "Terbuka",
      d.isVerified ? "Lunas" : "Pending",
      d.transaction?.paymentType || "Direct",
      d.createdAt,
      `"${(d.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-donasi-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Data
  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.donorEmail && d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.transaction?.orderId && d.transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === "verified") return d.isVerified;
    if (statusFilter === "pending") return !d.isVerified;
    if (statusFilter === "anonymous") return d.isAnonymous;
    return true;
  });

  // Perhitungan Statistik Cepat
  const totalVerifiedAmount = donations
    .filter((d) => d.isVerified)
    .reduce((sum, d) => sum + d.amount, 0);
  const countVerified = donations.filter((d) => d.isVerified).length;
  const countPending = donations.filter((d) => !d.isVerified).length;
  const countAnonymous = donations.filter((d) => d.isAnonymous).length;

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Kelola & Audit Donasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Admin memiliki akses audit seluruh nama asli donatur untuk verifikasi dan pembukuan akuntabel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Ekspor CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Catat Donasi Manual
          </Button>
        </div>
      </div>

      {/* 4 Kartu Ringkasan Donasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 space-y-1.5 shadow-xs min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Terverifikasi
          </span>
          <div className="text-lg sm:text-xl font-black text-[#185334] truncate" title={formatRupiah(totalVerifiedAmount)}>
            {formatRupiah(totalVerifiedAmount)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium block truncate">
            {countVerified} transaksi lunas
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 space-y-1.5 shadow-xs min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Record
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 truncate">
            {donations.length} Transaksi
          </div>
          <span className="text-[11px] text-slate-400 font-medium block truncate">
            Data tersimpan di Supabase
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 space-y-1.5 shadow-xs min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Menunggu Verifikasi
          </span>
          <div className="text-lg sm:text-xl font-black text-amber-600 truncate">
            {countPending}
          </div>
          <span className="text-[11px] text-slate-400 font-medium block truncate">
            Transaksi belum diverifikasi
          </span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 space-y-1.5 shadow-xs min-w-0">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Donatur Anonim
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-700 truncate">
            {countAnonymous}
          </div>
          <span className="text-[11px] text-slate-400 font-medium block truncate">
            Memilih label Hamba Allah
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "all"
                ? "bg-[#185334] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua ({donations.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("verified")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "verified"
                ? "bg-[#185334] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Terverifikasi ({countVerified})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "pending"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Pending ({countPending})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("anonymous")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === "anonymous"
                ? "bg-[#185334] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Anonim ({countAnonymous})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, email, order ID..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#185334] transition-all font-medium"
          />
        </div>
      </div>

      {/* Tabel Data Donasi */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-14 text-center text-xs text-slate-400">
            Memuat data donasi dari Supabase...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="p-14 text-center text-xs text-slate-400 space-y-1">
            <p className="font-bold text-slate-700">Tidak ada donasi yang sesuai</p>
            <p>Silakan sesuaikan filter atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Nama Donatur</th>
                  <th className="py-3.5 px-4">Kontak / Email</th>
                  <th className="py-3.5 px-4">Nominal</th>
                  <th className="py-3.5 px-4">Opsi Publik</th>
                  <th className="py-3.5 px-4">Order ID & Status</th>
                  <th className="py-3.5 px-4">Waktu</th>
                  <th className="py-3.5 px-4 text-right">Aksi Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{d.donorName}</div>
                      {d.message && (
                        <div className="text-[11px] text-slate-400 font-normal italic mt-0.5 line-clamp-1">
                          &ldquo;{d.message}&rdquo;
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {d.donorEmail || "-"}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#185334] whitespace-nowrap text-sm">
                      {formatRupiah(d.amount)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {d.isAnonymous ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                          Anonim (Hamba Allah)
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          Nama Terbuka
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      <div className="font-mono text-slate-700 font-bold">
                        {d.transaction?.orderId || "-"}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {d.transaction?.paymentType || "direct"} • {d.transaction?.status || "pending"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {formatDateTime(d.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedDonation(d)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Lihat Detail Transaksi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleVerification(d.id, d.isVerified)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 shadow-2xs ${
                            d.isVerified
                              ? "text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60"
                              : "text-white bg-[#185334] hover:bg-[#124229]"
                          }`}
                        >
                          {d.isVerified ? (
                            <span>Batalkan</span>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verifikasi</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Detail Donasi */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 tracking-tight">
                Rincian Transaksi Donasi
              </h3>
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedDonation.transaction?.orderId || "-"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Nama Donatur</span>
                <span className="font-bold text-slate-900">
                  {selectedDonation.donorName}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email Kontak</span>
                <span className="text-slate-700">
                  {selectedDonation.donorEmail || "Tidak disertakan"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Nominal Bersih</span>
                <span className="font-black text-[#185334] text-base">
                  {formatRupiah(selectedDonation.amount)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status Audit</span>
                <span>
                  {selectedDonation.isVerified ? (
                    <span className="text-xs font-semibold text-[#185334] bg-[#EBF5EF] px-2.5 py-0.5 rounded-full">
                      Terverifikasi (Lunas)
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      Menunggu Verifikasi
                    </span>
                  )}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Waktu Tercatat</span>
                <span className="text-slate-700">
                  {formatDateTime(selectedDonation.createdAt)}
                </span>
              </div>

              {selectedDonation.message && (
                <div className="pt-2">
                  <span className="text-slate-500 block mb-1">Pesan Doa Donatur:</span>
                  <div className="p-3 rounded-xl bg-slate-50 text-slate-700 italic border border-slate-100">
                    &ldquo;{selectedDonation.message}&rdquo;
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedDonation(null)}
              >
                Tutup
              </Button>
              <Button
                variant={selectedDonation.isVerified ? "outline" : "primary"}
                size="md"
                onClick={() =>
                  handleToggleVerification(selectedDonation.id, selectedDonation.isVerified)
                }
              >
                {selectedDonation.isVerified ? "Batalkan Verifikasi" : "Verifikasi Sekarang"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Catat Donasi Manual */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                  Catat Donasi Manual
                </h3>
                <p className="text-xs text-slate-500">
                  Tercatat langsung di Supabase dengan status lunas.
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

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateManualDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Donatur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Contoh: Budi Santoso (Temanggung)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email / Kontak (Opsional)
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="donatur@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nominal Donasi (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="10000"
                  step="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-[#185334] focus:outline-none focus:ring-2 focus:ring-[#185334]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pesan / Doa (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Pesan untuk relawan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modal-anonymous-donasi"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#185334] focus:ring-[#185334]"
                />
                <label htmlFor="modal-anonymous-donasi" className="text-xs text-slate-600 font-medium">
                  Tampilkan sebagai Hamba Allah (Anonim di publik)
                </label>
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
                  Simpan & Verifikasi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
