"use client";

import React from "react";
import { MessageSquare, User, Calendar } from "lucide-react";
import { formatShortDate } from "@/lib/formatter";
import type { PrayerPublic } from "@/types";

export interface PrayerCardProps {
  prayer: PrayerPublic;
  index?: number;
}

export function PrayerCard({ prayer }: PrayerCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#185334]/25 transition-all flex flex-col justify-between h-full">
      <div className="space-y-3">
        {/* Card Header: Avatar, Name, and Date */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-[#EBF5EF] text-[#185334] flex items-center justify-center text-xs font-bold shrink-0">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
              {prayer.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 shrink-0 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-[#185334]" />
            <time dateTime={prayer.createdAt}>{formatShortDate(prayer.createdAt)}</time>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
          &ldquo;{prayer.message}&rdquo;
        </p>
      </div>

      {/* Footer Tag */}
      <div className="pt-3 mt-3 border-t border-slate-50 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
        <MessageSquare className="w-3.5 h-3.5 text-[#185334]" />
        <span>Doa penguat sesama warga</span>
      </div>
    </div>
  );
}
