"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";
import { TreePine, Flame, Users, ShieldCheck, HeartHandshake } from "lucide-react";
import { formatRupiah } from "@/lib/formatter";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export interface DonationCounterProps {
  initialTotal?: number;
  donorCount?: number;
  verifiedCount?: number;
  variant?: "default" | "hero";
  className?: string;
}

export function DonationCounter({
  initialTotal = 0,
  donorCount = 0,
  verifiedCount = 0,
  variant = "default",
  className = "",
}: DonationCounterProps) {
  const [total, setTotal] = useState(initialTotal);
  const [donors, setDonors] = useState(donorCount);

  // Animated Spring for count-up
  const springValue = useSpring(0, {
    stiffness: 45,
    damping: 20,
    duration: 2000,
  });

  const displayValue = useTransform(springValue, (current) =>
    formatRupiah(Math.floor(current))
  );

  const [formattedDisplay, setFormattedDisplay] = useState(formatRupiah(0));

  useEffect(() => {
    springValue.set(total);
    const unsubscribe = displayValue.on("change", (latest) => {
      setFormattedDisplay(latest);
    });
    return () => unsubscribe();
  }, [total, springValue, displayValue]);

  // Update if props change
  useEffect(() => {
    setTotal(initialTotal);
    setDonors(donorCount);
  }, [initialTotal, donorCount]);

  // Stage calculation for Signature Recovery Visual (0 to 100%)
  const targetThreshold = 100000000; // Rp 100.000.000 target pemulihan
  const recoveryProgress = Math.min(Math.round((total / targetThreshold) * 100), 100);

  if (variant === "hero") {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-white border border-[var(--color-border)] p-5 sm:p-7 shadow-md ${className}`}>
        {/* Background Accent Decorative Subtle Glow */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-[var(--color-primary-light)]/60 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="relative z-10 space-y-5">
          {/* Header Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Donasi Terbuka</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[var(--color-secondary)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <span>Real-time</span>
            </div>
          </div>

          {/* Counter Display */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[var(--color-secondary)] uppercase tracking-wider">
              Total Dana Terkumpul
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-[var(--color-foreground)] tracking-tight">
              {formattedDisplay}
            </div>
            <p className="text-xs text-[var(--color-secondary)] pt-1">
              Bantuan masker N95, suplai pemadam darurat, dan logistik posko Kalimantan.
            </p>
          </div>

          {/* Recovery Progress Bar */}
          <div className="bg-[var(--color-background)] rounded-xl p-3.5 border border-[var(--color-border)] space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--color-secondary)]">
              <span className="flex items-center gap-1.5 font-semibold text-[var(--color-foreground)]">
                <TreePine className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Target Darurat (Rp 100 Juta)</span>
              </span>
              <span className="font-bold text-[var(--color-primary)]">{recoveryProgress}%</span>
            </div>

            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${recoveryProgress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-[var(--color-primary)] rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--color-secondary)] pt-0.5">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-[var(--color-accent)]" />
                <span>Tanggap Darurat</span>
              </span>
              <span className="flex items-center gap-1">
                <TreePine className="w-3 h-3 text-[var(--color-primary)]" />
                <span>Reboisasi Lahan</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[var(--color-border)]">
            <div className="text-center p-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]/50">
              <div className="text-base sm:text-lg font-bold text-[var(--color-foreground)]">
                {donors.toLocaleString("id-ID")}
              </div>
              <div className="text-[11px] text-[var(--color-secondary)]">Donatur</div>
            </div>

            <div className="text-center p-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]/50">
              <div className="text-base sm:text-lg font-bold text-[var(--color-foreground)]">
                {verifiedCount > 0 ? verifiedCount.toLocaleString("id-ID") : donors.toLocaleString("id-ID")}
              </div>
              <div className="text-[11px] text-[var(--color-secondary)]">Terverifikasi</div>
            </div>

            <div className="text-center p-2 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]/50">
              <div className="text-base sm:text-lg font-bold text-[var(--color-primary)]">
                100%
              </div>
              <div className="text-[11px] text-[var(--color-secondary)]">Tersalurkan</div>
            </div>
          </div>

          {/* Card Direct Action */}
          <Link href="/donasi" className="block pt-1">
            <Button variant="primary" size="md" className="w-full justify-center shadow-xs">
              Salurkan Donasi Sekarang
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-[var(--color-border)] p-6 sm:p-8 shadow-sm">
      {/* Background Accent Decorative Subtle Grid */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary-light)]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Pembaruan Donasi Publik</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[var(--color-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span>Terverifikasi Otomatis</span>
          </div>
        </div>

        {/* Counter Display & Signature Tree Growth Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <span className="text-sm font-medium text-[var(--color-secondary)]">
              Total Dana Terkumpul
            </span>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-foreground)] tracking-tight">
              {formattedDisplay}
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-secondary)] pt-1">
              Didistribusikan untuk logistik pemadaman darurat, masker pelindung warga, dan bibit rehabilitasi lahan gambut di Kalimantan.
            </p>
          </div>

          {/* Signature Element: Pemulihan Ekosistem / Tree Stage */}
          <div className="lg:col-span-4 bg-[var(--color-background)] rounded-xl p-4 border border-[var(--color-border)]">
            <div className="flex items-center justify-between text-xs font-medium text-[var(--color-secondary)] mb-2">
              <span className="flex items-center gap-1.5">
                <TreePine className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Tahap Pemulihan</span>
              </span>
              <span className="font-bold text-[var(--color-primary)]">{recoveryProgress}%</span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${recoveryProgress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-[var(--color-primary)] rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--color-secondary)] mt-2">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-[var(--color-accent)]" />
                <span>Tanggap Darurat</span>
              </span>
              <span className="flex items-center gap-1">
                <TreePine className="w-3 h-3 text-[var(--color-primary)]" />
                <span>Reboisasi Lahan</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary-light)] flex items-center justify-center text-[var(--color-primary)]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-[var(--color-foreground)]">
                {donors.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-[var(--color-secondary)]">Donatur Bergabung</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success-light)] flex items-center justify-center text-[var(--color-success)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-[var(--color-foreground)]">
                {verifiedCount > 0 ? verifiedCount.toLocaleString("id-ID") : donors.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-[var(--color-secondary)]">Transaksi Terverifikasi</div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-light)] flex items-center justify-center text-[var(--color-accent)]">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-[var(--color-foreground)]">
                100%
              </div>
              <div className="text-xs text-[var(--color-secondary)]">Penyaluran Langsung</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
