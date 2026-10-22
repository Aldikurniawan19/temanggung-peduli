"use client";

import React, { useEffect, useState } from "react";
import { MessageSquareCheck, Check, X, Trash2, Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/formatter";
import { Button } from "@/components/ui/Button";

export default function AdminUcapanPage() {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrayers = async () => {
    try {
      setIsLoading(true);
      const statusQuery = filter === "all" ? "" : `&status=${filter}`;
      const res = await fetch(`/api/admin/ucapan?limit=100${statusQuery}`);
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

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus doa ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/admin/ucapan?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setPrayers((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Gagal menghapus doa:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
            Moderasi Doa & Ucapan
          </h1>
          <p className="text-sm text-[var(--color-secondary)] mt-0.5">
            Tinjau pesan doa masyarakat sebelum diterbitkan secara terbuka di dinding publik.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === "pending"
                ? "bg-white text-[var(--color-foreground)] shadow-xs"
                : "text-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Menunggu Tinjauan
          </button>
          <button
            type="button"
            onClick={() => setFilter("approved")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === "approved"
                ? "bg-white text-[var(--color-foreground)] shadow-xs"
                : "text-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Sudah Terbit
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === "all"
                ? "bg-white text-[var(--color-foreground)] shadow-xs"
                : "text-[var(--color-secondary)] hover:text-[var(--color-foreground)]"
            }`}
          >
            Semua
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-12 text-center text-sm text-[var(--color-secondary)]">
            Memuat daftar doa...
          </div>
        ) : prayers.length === 0 ? (
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-12 text-center text-sm text-[var(--color-secondary)]">
            Tidak ada doa dalam status ini.
          </div>
        ) : (
          prayers.map((prayer) => (
            <div
              key={prayer.id}
              className="bg-white border border-[var(--color-border)] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm text-[var(--color-foreground)] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    {prayer.name}
                  </span>
                  <span className="text-xs text-[var(--color-secondary)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateTime(prayer.createdAt)}
                  </span>
                  {prayer.isApproved ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                      Disetujui
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Menunggu
                    </span>
                  )}
                </div>

                <p className="text-sm text-[var(--color-foreground)] leading-relaxed italic">
                  &ldquo;{prayer.message}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!prayer.isApproved ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSetApproval(prayer.id, true)}
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Setujui
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetApproval(prayer.id, false)}
                    leftIcon={<X className="w-3.5 h-3.5" />}
                  >
                    Batalkan
                  </Button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(prayer.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors"
                  aria-label="Hapus doa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
