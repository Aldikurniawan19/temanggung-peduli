"use client";

import React, { useEffect, useState } from "react";
import { HeartHandshake, CheckCircle2, XCircle, Search, ShieldCheck } from "lucide-react";
import { formatRupiah, formatDateTime } from "@/lib/formatter";
import { Button } from "@/components/ui/Button";

export default function AdminDonasiPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/donasi?limit=100");
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
      }
    } catch (err) {
      console.error("Gagal update verifikasi:", err);
    }
  };

  const filteredDonations = donations.filter(
    (d) =>
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.donorEmail && d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.transaction?.orderId && d.transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Daftar Seluruh Donasi
          </h1>
          <p className="text-sm text-[var(--color-secondary)] mt-0.5">
            Admin dapat melihat nama asli seluruh donatur untuk audit, termasuk donatur yang memilih mode anonim.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, email, order ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-[var(--color-secondary)]">
            Memuat data donasi...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="p-12 text-center text-sm text-[var(--color-secondary)]">
            Tidak ada donasi yang sesuai dengan pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Nama Asli Donatur</th>
                  <th className="py-3.5 px-4">Kontak / Email</th>
                  <th className="py-3.5 px-4">Nominal</th>
                  <th className="py-3.5 px-4">Tampilan Publik</th>
                  <th className="py-3.5 px-4">Order ID & Status</th>
                  <th className="py-3.5 px-4">Waktu</th>
                  <th className="py-3.5 px-4 text-right">Aksi Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-semibold text-[var(--color-foreground)]">
                      <div>{d.donorName}</div>
                      {d.message && (
                        <div className="text-[11px] text-[var(--color-secondary)] font-normal italic mt-0.5 line-clamp-1">
                          &ldquo;{d.message}&rdquo;
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-[var(--color-secondary)]">
                      {d.donorEmail || "-"}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[var(--color-primary)] whitespace-nowrap">
                      {formatRupiah(d.amount)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {d.isAnonymous ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Hamba Allah (Anonim)
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                          Nama Terbuka
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      <div className="font-mono text-gray-600 font-medium">
                        {d.transaction?.orderId || "-"}
                      </div>
                      <div className="text-[11px] text-gray-400 capitalize">
                        {d.transaction?.paymentType || "Midtrans"} • {d.transaction?.status || "Pending"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-[var(--color-secondary)] whitespace-nowrap">
                      {formatDateTime(d.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant={d.isVerified ? "outline" : "primary"}
                        size="sm"
                        onClick={() => handleToggleVerification(d.id, d.isVerified)}
                        leftIcon={
                          d.isVerified ? (
                            <XCircle className="w-3.5 h-3.5 text-[var(--color-danger)]" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          )
                        }
                      >
                        {d.isVerified ? "Batal Verifikasi" : "Verifikasi"}
                      </Button>
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
