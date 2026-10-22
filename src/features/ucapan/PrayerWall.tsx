"use client";

import React from "react";
import { MessageSquareQuote } from "lucide-react";
import { MotionStagger, MotionCard } from "@/components/ui/Motion";
import { PrayerCard } from "./PrayerCard";
import type { PrayerPublic } from "@/types";

export interface PrayerWallProps {
  prayers: PrayerPublic[];
}

export function PrayerWall({ prayers }: PrayerWallProps) {
  if (!prayers || prayers.length === 0) {
    return (
      <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-3xl bg-white/60">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <MessageSquareQuote className="w-6 h-6" />
        </div>
        <h4 className="text-base font-extrabold text-slate-900">
          Belum Ada Doa yang Ditampilkan
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
          Jadilah orang pertama yang mengirimkan doa dan kata penyemangat untuk saudara-saudara kita.
        </p>
      </div>
    );
  }

  return (
    <MotionStagger className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      {prayers.map((prayer, index) => (
        <MotionCard key={prayer.id} className="h-full">
          <PrayerCard prayer={prayer} index={index} />
        </MotionCard>
      ))}
    </MotionStagger>
  );
}
