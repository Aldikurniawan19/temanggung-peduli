"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  User,
  Calendar,
} from "lucide-react";
import { formatShortDate } from "@/lib/formatter";
import type { PrayerPublic } from "@/types";

export interface RecentPrayersSliderProps {
  prayers: PrayerPublic[];
}

export function RecentPrayersSlider({ prayers }: RecentPrayersSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive itemsPerPage
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, prayers.length - itemsPerPage);

  // Auto Slider Timer
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
  };

  if (!prayers || prayers.length === 0) {
    return null;
  }

  // Width per card depending on itemsPerPage
  const cardWidthClass =
    itemsPerPage === 1
      ? "w-full flex-none"
      : itemsPerPage === 2
      ? "w-1/2 flex-none"
      : "w-1/3 flex-none";

  const totalDots = maxIndex + 1;

  return (
    <section className="space-y-6">
      {/* Header and Controls */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#185334] uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Dukungan Doa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Doa & Penguat dari Relawan dan Donatur
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Untaian doa tulus dan kata penyemangat untuk saudara kita di Kalimantan.
          </p>
        </div>

        {/* Controls Bar Below Title */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Slider Prev & Next Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={maxIndex <= 0}
              aria-label="Doa sebelumnya"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#185334] hover:border-[#185334]/40 hover:bg-[#EBF5EF]/40 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185334] shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={maxIndex <= 0}
              aria-label="Doa berikutnya"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#185334] hover:border-[#185334]/40 hover:bg-[#EBF5EF]/40 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185334] shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action Link */}
          <Link
            href="/ucapan"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#185334] hover:underline transition-colors shrink-0"
          >
            <span>Lihat Semua Doa</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Slider Carousel Viewport */}
      <div
        className="relative overflow-hidden -mx-2 px-2 py-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {prayers.map((prayer) => (
            <div key={prayer.id} className={`${cardWidthClass} p-2`}>
              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-[#185334]/25 transition-all flex flex-col justify-between h-full min-h-[175px]">
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#EBF5EF] text-[#185334] flex items-center justify-center text-xs font-bold shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                        {prayer.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                      <Calendar className="w-3 h-3 text-[#185334]" />
                      <span>{formatShortDate(prayer.createdAt)}</span>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic line-clamp-3">
                    &ldquo;{prayer.message}&rdquo;
                  </p>
                </div>

                {/* Footer Tag */}
                <div className="pt-3 mt-3 border-t border-slate-50 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <MessageSquare className="w-3 h-3 text-[#185334]" />
                  <span>Doa penguat sesama warga</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots Indicator */}
      {totalDots > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {Array.from({ length: totalDots }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ke slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all focus:outline-none ${
                currentIndex === idx
                  ? "w-6 bg-[#185334]"
                  : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
