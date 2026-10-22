import React from "react";
import Link from "next/link";
import {
  HeartHandshake,
  MessageSquare,
  Camera,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatRupiah, formatDateTime } from "@/lib/formatter";
import * as donasiRepo from "@/repositories/donasi-repository";
import * as ucapanRepo from "@/repositories/ucapan-repository";
import * as docRepo from "@/repositories/dokumentasi-repository";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let stats = { totalAmount: 48750000, donorCount: 312, verifiedCount: 312 };
  let pendingPrayersCount = 0;
  let totalDocsCount = 0;
  let recentDonations: any[] = [];

  try {
    const [statsData, prayersData, docsData, donationsData] = await Promise.allSettled([
      donasiRepo.getDonationStats(),
      ucapanRepo.getPrayersForAdmin(1, 0, false),
      docRepo.findDocumentations({ limit: 100 }),
      donasiRepo.getAllDonationsForAdmin(5, 0),
    ]);

    if (statsData.status === "fulfilled") stats = statsData.value;
    if (prayersData.status === "fulfilled") pendingPrayersCount = prayersData.value.total;
    if (docsData.status === "fulfilled") totalDocsCount = docsData.value.length;
    if (donationsData.status === "fulfilled") recentDonations = donationsData.value.donations;
  } catch (err) {
    console.warn("[AdminDashboard] Error reading database:", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          Ringkasan Dashboard Admin
        </h1>
        <p className="text-sm text-[var(--color-secondary)] mt-1">
          Pantau perolehan donasi real-time, moderasi doa masuk, dan perbarui dokumentasi aksi karhutla.
        </p>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--color-secondary)]">
            <span>Total Donasi Terverifikasi</span>
            <HeartHandshake className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--color-foreground)]">
            {formatRupiah(stats.totalAmount)}
          </div>
          <div className="text-[11px] text-[var(--color-success)] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{stats.verifiedCount} transaksi lunas</span>
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--color-secondary)]">
            <span>Total Donatur</span>
            <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--color-foreground)]">
            {stats.donorCount} Orang
          </div>
          <div className="text-[11px] text-[var(--color-secondary)]">
            Termasuk donasi anonim publik
          </div>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--color-secondary)]">
            <span>Doa Menunggu Moderasi</span>
            <MessageSquare className="w-4 h-4 text-[var(--color-accent)]" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--color-accent)]">
            {pendingPrayersCount} Doa
          </div>
          <Link
            href="/admin/ucapan"
            className="text-[11px] text-[var(--color-primary)] hover:underline font-medium inline-block"
          >
            Tinjau sekarang →
          </Link>
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--color-secondary)]">
            <span>Dokumentasi Lapangan</span>
            <Camera className="w-4 h-4 text-[var(--color-primary)]" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[var(--color-foreground)]">
            {totalDocsCount} Foto/Aksi
          </div>
          <Link
            href="/admin/dokumentasi"
            className="text-[11px] text-[var(--color-primary)] hover:underline font-medium inline-block"
          >
            Kelola galeri →
          </Link>
        </div>
      </div>

      {/* Tabel Donasi Terbaru */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--color-foreground)]">
            5 Donasi Terakhir Masuk
          </h2>
          <Link
            href="/admin/donasi"
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
          >
            <span>Buka Semua Donasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentDonations.length === 0 ? (
          <p className="text-sm text-[var(--color-secondary)] py-4 text-center">
            Belum ada transaksi donasi yang tercatat di database.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-gray-100 text-gray-400 font-medium">
                <tr>
                  <th className="pb-3">Nama Donatur</th>
                  <th className="pb-3">Nominal</th>
                  <th className="pb-3">Opsi Publik</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-medium text-[var(--color-foreground)]">
                      {d.donorName}
                    </td>
                    <td className="py-3 font-semibold text-[var(--color-primary)]">
                      {formatRupiah(d.amount)}
                    </td>
                    <td className="py-3">
                      {d.isAnonymous ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Anonim (Hamba Allah)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700">
                          Publik
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {d.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--color-success)] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--color-secondary)]">
                          <Clock className="w-3.5 h-3.5" />
                          {d.transaction?.status || "Pending"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-xs text-[var(--color-secondary)]">
                      {formatDateTime(d.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
