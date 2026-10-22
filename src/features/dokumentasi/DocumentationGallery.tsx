"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Calendar, X, ExternalLink, Layers, Truck, HeartHandshake } from "lucide-react";
import { formatDate } from "@/lib/formatter";
import { DocumentationCard } from "./DocumentationCard";
import type { DocumentationPublic } from "@/types";

export interface DocumentationGalleryProps {
  initialItems: DocumentationPublic[];
}

type TabType = "all" | "penyaluran" | "galang_donasi";

export function DocumentationGallery({ initialItems }: DocumentationGalleryProps) {
  const [selectedType, setSelectedType] = useState<TabType>("all");
  const [activeItem, setActiveItem] = useState<DocumentationPublic | null>(null);

  const penyaluranCount = initialItems.filter((i) => i.type === "penyaluran").length;
  const galangCount = initialItems.filter((i) => i.type === "galang_donasi").length;

  const filteredItems = initialItems.filter((item) => {
    if (selectedType === "all") return true;
    return item.type === selectedType;
  });

  const tabs: { id: TabType; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: "all",
      label: "Semua Kegiatan",
      count: initialItems.length,
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: "penyaluran",
      label: "Penyaluran Bantuan",
      count: penyaluranCount,
      icon: <Truck className="w-3.5 h-3.5" />,
    },
    {
      id: "galang_donasi",
      label: "Aksi Galang Dana",
      count: galangCount,
      icon: <HeartHandshake className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Modern Segmented Pill Filters */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-2xs gap-1 sm:gap-1.5 max-w-full overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedType(tab.id)}
                className={`relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185334] whitespace-nowrap ${
                  isActive
                    ? "bg-[#185334] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <span className={isActive ? "text-white" : "text-slate-400"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Documentation Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-200 bg-white/60">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Camera className="w-6 h-6" />
          </div>
          <h4 className="text-base font-extrabold text-slate-900">
            Belum Ada Dokumentasi
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
            Dokumentasi foto dan catatan lapangan untuk kategori ini akan diperbarui segera.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredItems.map((item, index) => (
            <DocumentationCard
              key={item.id}
              item={item}
              index={index}
              onSelect={(selected) => setActiveItem(selected)}
            />
          ))}
        </div>
      )}

      {/* Modern Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setActiveItem(null)}
              aria-hidden="true"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 my-auto flex flex-col"
            >
              {/* Close Button Top Right */}
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Tutup dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* High-Resolution Image Preview */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-950 overflow-hidden">
                <Image
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  fill
                  unoptimized={activeItem.imageUrl.startsWith("data:")}
                  sizes="(max-width: 1200px) 100vw, 850px"
                  className="object-contain"
                />

                {/* Badge Category Overlay */}
                <div className="absolute bottom-3.5 left-3.5 z-10">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${
                      activeItem.type === "galang_donasi"
                        ? "bg-amber-600/95 text-white"
                        : "bg-[#185334]/95 text-white"
                    }`}
                  >
                    {activeItem.type === "galang_donasi"
                      ? "Aksi Galang Dana"
                      : "Penyaluran Bantuan"}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-7 space-y-3.5">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#185334]" />
                  <time dateTime={activeItem.eventDate}>
                    {formatDate(activeItem.eventDate)}
                  </time>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug tracking-tight">
                  {activeItem.title}
                </h2>

                {/* Full Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line pt-1">
                  {activeItem.description}
                </p>

                {/* Modal Footer Actions */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={activeItem.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#185334] hover:underline"
                  >
                    <span>Buka Foto Asli</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setActiveItem(null)}
                    className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
