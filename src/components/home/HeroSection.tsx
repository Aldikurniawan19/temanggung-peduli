"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Flame, HandHelping } from "lucide-react";
import { formatRupiah } from "@/lib/formatter";
import { WaterWaveGauge } from "./WaterWaveGauge";

interface HeroSectionProps {
  totalAmount?: number;
  donorCount?: number;
  targetAmount?: number;
}

export function HeroSection({
  totalAmount = 125750000,
  donorCount = 1420,
  targetAmount = 250000000,
}: HeroSectionProps) {
  const progressPercent =
    targetAmount > 0
      ? Math.min(Math.round((totalAmount / targetAmount) * 100), 100)
      : 50;

  return (
    <section
      id="beranda"
      className="relative overflow-hidden min-h-[500px] md:min-h-[540px] lg:min-h-[580px] flex items-center scroll-mt-24 bg-white"
    >
      {/* Background Image Desktop with Smooth Fade-In */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block absolute inset-0 bg-no-repeat bg-right pointer-events-none"
        style={{
          backgroundImage: "url('/assets/bgDesktophero.png')",
          backgroundPosition: "right center",
          backgroundSize: "cover",
        }}
        aria-hidden="true"
      />

      {/* Background Image Mobile with Smooth Fade-In */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="block md:hidden absolute inset-0 bg-cover bg-no-repeat bg-top pointer-events-none"
        style={{ backgroundImage: "url('/assets/bgMobileHero.png')" }}
        aria-hidden="true"
      />

      {/* Subtle Gradient Overlay for Mobile to ensure contrast */}
      <div
        className="block md:hidden absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 w-full">
        <div className="max-w-xl lg:max-w-2xl text-left">
          {/* Pill Tag */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-xs font-semibold mb-4 shadow-xs"
          >
          </motion.div>

          {/* Headline H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.14] mb-4"
          >
            Bersama Selamatkan Hutan Kita
          </motion.h1>

          {/* Paragraph Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mb-6"
          >
            Karhutla bukan hanya merusak hutan, tetapi juga mengancam kehidupan manusia, satwa, dan masa depan bumi. Mari berikan bantuan terbaik untuk mendukung upaya penanggulangan karhutla di berbagai wilayah terdampak.
          </motion.p>

          {/* CTA Button & Live Total Donation Badge with Water Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3.5 pt-1"
          >
            <Link href="/donasi">
              <button
                type="button"
                className="rounded-full bg-[#185334] hover:bg-[#124229] text-white px-7 py-3.5 font-semibold text-sm flex items-center gap-2.5 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <HandHelping className="w-4 h-4" />
                <span>Donasi Sekarang</span>
              </button>
            </Link>

            {/* Live Donation Pill Badge with Water Gauge */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-xs hover:border-[#185334]/30 transition-all">
              {/* Realistic Fluid Water Wave Gauge */}
              <WaterWaveGauge percent={progressPercent} size={42} />

              <div className="text-left pr-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Total Terkumpul</span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded-full normal-case">
                    {progressPercent}% target
                  </span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-[#185334] tracking-tight leading-snug">
                  {formatRupiah(totalAmount)}{" "}
                  <span className="text-xs font-semibold text-slate-500">
                    &bull; {donorCount.toLocaleString("id-ID")}+ donatur
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating text mark next to firefighter on desktop */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="hidden xl:flex flex-col absolute right-52 xl:right-64 top-1/2 -translate-y-4 text-white font-bold text-sm tracking-wide leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] pointer-events-none select-none"
      >
        <span>Hutan Lestari</span>
        <span className="text-xs font-semibold text-emerald-200">Masa Depan Berseri</span>
      </motion.div>
    </section>
  );
}
