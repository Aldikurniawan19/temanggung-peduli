"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Calendar, Eye, ArrowUpRight } from "lucide-react";
import { formatShortDate } from "@/lib/formatter";
import type { DocumentationPublic } from "@/types";

export interface DocumentationCardProps {
  item: DocumentationPublic;
  onSelect: (item: DocumentationPublic) => void;
  index?: number;
}

export function DocumentationCard({
  item,
  onSelect,
  index = 0,
}: DocumentationCardProps) {
  const isGalang = item.type === "galang_donasi";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.35), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }}
      onClick={() => onSelect(item)}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#185334]/20 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      {/* Image Container with 16:10 Aspect Ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          unoptimized={item.imageUrl.startsWith("data:")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Category Pill Tag */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold shadow-xs backdrop-blur-md ${
              isGalang
                ? "bg-amber-600/90 text-white"
                : "bg-[#185334]/90 text-white"
            }`}
          >
            {isGalang ? "Aksi Galang Dana" : "Penyaluran Bantuan"}
          </span>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-slate-900 shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-3.5 h-3.5 text-[#185334]" />
            <span>Lihat Detail</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2.5">
            <Calendar className="w-3.5 h-3.5 text-[#185334]" />
            <time dateTime={item.eventDate}>{formatShortDate(item.eventDate)}</time>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-[#185334] transition-colors line-clamp-2 leading-snug tracking-tight">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mt-2.5">
            {item.description}
          </p>
        </div>

        {/* Card Footer Link */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#185334]">
          <span>Buka Dokumentasi</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.article>
  );
}
