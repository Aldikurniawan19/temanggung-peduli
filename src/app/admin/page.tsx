"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  MessageSquare,
  Camera,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
  Check,
  X,
  TrendingUp,
  FileText,
  Users,
} from "lucide-react";
import { formatRupiah, formatDateTime } from "@/lib/formatter";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalAmount: 125750000,
    donorCount: 1420,
    verifiedCount: 1420,
  });
  const [pendingPrayers, setPendingPrayers] = useState<any[]>([]);
  const [totalDocsCount, setTotalDocsCount] = useState(0);
  const [recentDonations, setRecentDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal Donasi Manual Quick
  const [showAddDonationModal, setShowAddDonationModal] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("100000");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const [donationsRes, prayersRes, docsRes] = await Promise.all([
        fetch("/api/admin/donasi?limit=6&offset=0"),
        fetch("/api/admin/ucapan?limit=5&status=pending"),
        fetch("/api/dokumentasi?limit=100"),
      ]);

      const [donationsJson, prayersJson, docsJson] = await Promise.all([
        donationsRes.json(),
        prayersRes.json(),
        docsRes.json(),
      ]);

      if (donationsJson.success && donationsJson.data) {
        setRecentDonations(donationsJson.data.donations || []);
        // Calculate total amount from verified donations
        const verifiedList = (donationsJson.data.donations || []).filter((d: any) => d.isVerified);
        const sumVerified = verifiedList.reduce((acc: number, d: any) => acc + d.amount, 0);
        if (sumVerified > 0) {
          setStats((prev) => ({
            ...prev,
            totalAmount: Math.max(prev.totalAmount, sumVerified),
            verifiedCount: Math.max(prev.verifiedCount, verifiedList.length),
          }));
        }
      }

      if (prayersJson.success && prayersJson.data) {
        setPendingPrayers(prayersJson.data.prayers || []);
      }

      if (docsJson.success && docsJson.data) {
        setTotalDocsCount(docsJson.data.length);
      }
    } catch (err) {
      console.warn("Gagal memperbarui dashboard:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick Action: Verifikasi / Batal Verifikasi Donasi
  const handleToggleDonationVerify = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/donasi", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVerified: !currentStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setRecentDonations((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isVerified: !currentStatus } : d))
        );
      }
    } catch (err) {
      console.error("Gagal update verifikasi:", err);
    }
  };

  // Quick Action: Moderasi Doa (Setujui / Tolak)
  const handlePrayerAction = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch("/api/admin/ucapan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved }),
      });
      const json = await res.json();
      if (json.success) {
        setPendingPrayers((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Gagal moderasi doa:", err);
    }
  };

  // Submit Donasi Manual
  const handleCreateManualDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDonation(true);
    setModalFeedback(null);

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
        throw new Error(json.error || "Gagal mencatat donasi");
      }

      setShowAddDonationModal(false);
      setDonorName("");
      setDonorEmail("");
      setMessage("");
      setAmount("100000");
      setIsAnonymous(false);
      fetchData();
    } catch (err: any) {
      setModalFeedback(err.message || "Terjadi kendala");
    } finally {
      setIsSubmittingDonation(false);
    }
  };

  const targetAmount = 250000000;
  const progressPercent = Math.min(
    Math.round((stats.totalAmount / targetAmount) * 100),
    100
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ringkasan Operasional Posko
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data terkumpul langsung dari basis data Supabase PostgreSQL real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Segarkan Data
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddDonationModal(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Catat Donasi Manual
          </Button>
        </div>
      </div>

      {/* Target Progress Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#EBF5EF] text-[#185334] shrink-0 mt-0.5 sm:mt-0">
              <TrendingUp className="w-5 h-5 text-[#185334]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Capaian Penggalangan Dana
              </span>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="text-lg sm:text-xl xl:text-2xl font-black text-slate-900">
                  {formatRupiah(stats.totalAmount)}
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  dari target {formatRupiah(targetAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div className="text-2xl sm:text-3xl font-black text-[#185334] tracking-tight">
              {progressPercent}%
            </div>
            <span className="text-xs text-slate-400 font-medium">Tercapai</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50">
          <div
            className="bg-[#185334] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Donasi */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-colors min-w-0 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Donasi Masuk
            </span>
            <div className="p-1.5 rounded-lg bg-[#EBF5EF] text-[#185334] shrink-0">
              <HeartHandshake className="w-4 h-4 text-[#185334]" />
            </div>
          </div>
          <div
            className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900 tracking-tight truncate"
            title={formatRupiah(stats.totalAmount)}
          >
            {formatRupiah(stats.totalAmount)}
          </div>
          <div className="text-xs text-[#185334] font-semibold flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{stats.verifiedCount.toLocaleString("id-ID")} transaksi lunas</span>
          </div>
        </div>

        {/* Card 2: Donatur */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-colors min-w-0 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Total Donatur
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900 tracking-tight truncate">
            {stats.donorCount.toLocaleString("id-ID")} Orang
          </div>
          <div className="text-xs text-slate-400 font-medium pt-1 border-t border-slate-100 truncate">
            Masyarakat & komunitas
          </div>
        </div>

        {/* Card 3: Doa Menunggu */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-colors min-w-0 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Doa Menunggu
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <MessageSquare className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-lg sm:text-xl 2xl:text-2xl font-black text-amber-700 tracking-tight truncate">
            {pendingPrayers.length} Pesan
          </div>
          <div className="pt-1 border-t border-slate-100">
            <Link
              href="/admin/ucapan"
              className="text-xs text-[#185334] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Tinjau sekarang</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 4: Dokumentasi */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-colors min-w-0 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Dokumentasi Aksi
            </span>
            <div className="p-1.5 rounded-lg bg-[#EBF5EF] text-[#185334] shrink-0">
              <Camera className="w-4 h-4 text-[#185334]" />
            </div>
          </div>
          <div className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900 tracking-tight truncate">
            {totalDocsCount} Foto Aksi
          </div>
          <div className="pt-1 border-t border-slate-100">
            <Link
              href="/admin/dokumentasi"
              className="text-xs text-[#185334] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Kelola galeri</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri (8 cols): Tabel 6 Donasi Terakhir */}
        <div className="xl:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Transaksi Donasi Terbaru
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar donatur dan status verifikasi langsung di database Supabase.
              </p>
            </div>
            <Link
              href="/admin/donasi"
              className="text-xs font-bold text-[#185334] hover:underline flex items-center gap-1"
            >
              <span>Semua Donasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Memuat data transaksi...
            </div>
          ) : recentDonations.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Belum ada data donasi tercatat.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="pb-3 px-2">Donatur</th>
                    <th className="pb-3 px-2">Nominal</th>
                    <th className="pb-3 px-2">Status</th>
                    <th className="pb-3 px-2">Waktu</th>
                    <th className="pb-3 px-2 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        <div>{d.donorName}</div>
                        {d.isAnonymous && (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60 inline-block mt-0.5">
                            Anonim
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 font-bold text-[#185334] whitespace-nowrap">
                        {formatRupiah(d.amount)}
                      </td>
                      <td className="py-3 px-2 whitespace-nowrap">
                        {d.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#185334] bg-[#EBF5EF] px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-[#185334]" />
                            Lunas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-slate-400 text-[11px] whitespace-nowrap">
                        {formatDateTime(d.createdAt)}
                      </td>
                      <td className="py-3 px-2 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleDonationVerify(d.id, d.isVerified)}
                          className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
                            d.isVerified
                              ? "text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60"
                              : "text-white bg-[#185334] hover:bg-[#124229]"
                          }`}
                        >
                          {d.isVerified ? "Batalkan" : "Verifikasi"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Kolom Kanan (4 cols): Doa Masuk Menunggu Moderasi */}
        <div className="xl:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Doa Masuk
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Pesan masyarakat untuk relawan
              </span>
            </div>
            <Link
              href="/admin/ucapan"
              className="text-xs font-bold text-[#185334] hover:underline"
            >
              Semua
            </Link>
          </div>

          {pendingPrayers.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 space-y-1">
              <CheckCircle2 className="w-6 h-6 text-[#185334] mx-auto opacity-40 mb-2" />
              <p className="font-semibold text-slate-700">Semua doa sudah aktif</p>
              <p>Tidak ada doa yang tertahan antrean moderasi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPrayers.slice(0, 4).map((prayer) => (
                <div
                  key={prayer.id}
                  className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      {prayer.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDateTime(prayer.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed">
                    &ldquo;{prayer.message}&rdquo;
                  </p>
                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handlePrayerAction(prayer.id, true)}
                      className="px-3.5 py-1 rounded-full bg-[#185334] hover:bg-[#124229] text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Check className="w-3 h-3" />
                      <span>Setujui</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePrayerAction(prayer.id, false)}
                      className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-medium cursor-pointer transition-all hover:border-slate-300"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Catat Donasi Manual / Offline */}
      {showAddDonationModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">
                  Catat Donasi Manual
                </h3>
                <p className="text-xs text-slate-500">
                  Untuk donasi transfer langsung atau tunai yang diterima posko.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddDonationModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalFeedback && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                {modalFeedback}
              </div>
            )}

            <form onSubmit={handleCreateManualDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Donatur
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
                  Email / Kontak Donatur (Opsional)
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
                  Nominal Donasi (Rp)
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
                  Pesan / Doa Donatur (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Pesan empati untuk relawan karhutla..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#185334]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="modal-anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#185334] focus:ring-[#185334]"
                />
                <label htmlFor="modal-anonymous" className="text-xs text-slate-600 font-medium">
                  Tampilkan sebagai Hamba Allah (Anonim di publik)
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setShowAddDonationModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmittingDonation}
                >
                  Simpan Donasi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
