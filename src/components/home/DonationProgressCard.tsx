"use client";

import React from "react";
import { motion } from "motion/react";
import { Leaf, Coins, Target, Users } from "lucide-react";
import { formatRupiah } from "@/lib/formatter";
import { WaterWaveGauge } from "./WaterWaveGauge";

interface DonationProgressCardProps {
  currentAmount: number;
  targetAmount: number;
  donorCount: number;
  verifiedCount?: number;
}



export function DonationProgressCard({
  currentAmount,
  targetAmount,
  donorCount,
}: DonationProgressCardProps) {
  const progressPercent =
    targetAmount > 0
      ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header: Pill Badge + Heading + Description */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF5EE] text-[#137547] text-xs font-bold uppercase tracking-wider mb-2.5">
          <Leaf className="w-3.5 h-3.5 fill-[#137547] text-[#137547]" />
          <span>PROGRES DONASI</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-tight">
          Bersama <span className="text-[#137547]">Kita Bisa</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl leading-relaxed">
          Bantuan yang terkumpul disalurkan secara berkala untuk mendukung tim pemadam karhutla, logistik posko, dan bantuan medis warga terdampak.
        </p>
      </div>

      {/* 2. Main Progress Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#E5ECE7] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between gap-4">
          {/* Top Row: Amount & Label on Left, Circular Gauge on Right */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                TERKUMPUL SAAT INI
              </div>
              <div className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#137547] tracking-tight mt-1 leading-none">
                {formatRupiah(currentAmount)}
              </div>
            </div>

            {/* Water Wave Gauge Animation */}
            <div className="flex flex-col items-center shrink-0 translate-x-2.5 sm:translate-x-0">
              <WaterWaveGauge percent={progressPercent} size={68} />
              <span className="text-[11px] text-slate-500 font-medium mt-1.5">
                dari target
              </span>
              <span className="text-xs font-bold text-slate-800">
                {formatRupiah(targetAmount)}
              </span>
            </div>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="w-full sm:max-w-[70%] h-3 sm:h-3.5 bg-[#EAF2ED] rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progressPercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-[#137547] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 3. Three Stat Cards (Terkumpul, Target Dana, Donatur) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {/* Stat 1: Terkumpul */}
        <div className="bg-white rounded-2xl p-3 sm:p-4.5 border border-[#EBF1EC] shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3.5 transition-all hover:border-[#137547]/30">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#EAF5EE] flex items-center justify-center shrink-0 text-[#137547]">
            <Coins className="w-5 h-5 text-[#137547]" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-xs sm:text-sm lg:text-base text-slate-900 tracking-tight leading-snug truncate sm:whitespace-normal">
              {formatRupiah(currentAmount)}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Terkumpul
            </div>
          </div>
        </div>

        {/* Stat 2: Target Dana */}
        <div className="bg-white rounded-2xl p-3 sm:p-4.5 border border-[#EBF1EC] shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3.5 transition-all hover:border-[#137547]/30">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#EAF5EE] flex items-center justify-center shrink-0 text-[#137547]">
            <Target className="w-5 h-5 text-[#137547]" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-xs sm:text-sm lg:text-base text-slate-900 tracking-tight leading-snug truncate sm:whitespace-normal">
              {formatRupiah(targetAmount)}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Target Dana
            </div>
          </div>
        </div>

        {/* Stat 3: Donatur */}
        <div className="bg-white rounded-2xl p-3 sm:p-4.5 border border-[#EBF1EC] shadow-xs flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-2 sm:gap-3.5 transition-all hover:border-[#137547]/30">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#EAF5EE] flex items-center justify-center shrink-0 text-[#137547]">
            <Users className="w-5 h-5 text-[#137547]" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-xs sm:text-sm lg:text-base text-slate-900 tracking-tight leading-snug">
              {donorCount.toLocaleString("id-ID")}+
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Donatur
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
