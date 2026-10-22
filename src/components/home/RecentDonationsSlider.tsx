"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  User,
} from "lucide-react";
import { formatRupiah, formatShortDate } from "@/lib/formatter";
import type { DonationPublic } from "@/types";

export interface RecentDonationsSliderProps {
  donations: DonationPublic[];
}

export function RecentDonationsSlider({ donations }: RecentDonationsSliderProps) {
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

  const maxIndex = Math.max(0, donations.length - itemsPerPage);

  // Auto Slider Timer
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3800);

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

  if (!donations || donations.length === 0) {
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
            <HeartHandshake className="w-4 h-4" />
            <span>Dukungan Masyarakat</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Donasi Terbaru yang Diterima
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar kepedulian dan donasi nyata yang disalurkan para dermawan.
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
              aria-label="Donasi sebelumnya"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#185334] hover:border-[#185334]/40 hover:bg-[#EBF5EF]/40 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185334] shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={maxIndex <= 0}
              aria-label="Donasi berikutnya"
              className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#185334] hover:border-[#185334]/40 hover:bg-[#EBF5EF]/40 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185334] shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action Link */}
          <Link
            href="/donasi"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#185334] hover:underline transition-colors shrink-0"
          >
            <span>Ikut Berdonasi</span>
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
          {donations.map((item) => (
            <div key={item.id} className={`${cardWidthClass} p-2`}>
              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-[#185334]/25 transition-all flex flex-col justify-between h-full min-h-[175px]">
                <div className="space-y-2.5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {formatShortDate(item.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF5EF] text-[#185334] text-[11px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Terverifikasi</span>
                    </span>
                  </div>

                  {/* Donor Name */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#EBF5EF] text-[#185334] flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 line-clamp-1">
                      {item.displayName}
                    </span>
                  </div>

                  {/* Message */}
                  {item.message && (
                    <p className="text-xs text-slate-600 line-clamp-2 italic leading-relaxed pt-0.5">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  )}
                </div>

                {/* Card Footer: Amount */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Nominal Donasi</span>
                  <span className="font-black text-sm sm:text-base text-[#185334]">
                    {formatRupiah(item.amount)}
                  </span>
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
