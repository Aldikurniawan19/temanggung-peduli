"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ShieldCheck, HeartHandshake, FileText, Sparkles } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Berapa batas minimal donasi melalui platform ini?",
    answer:
      "Minimal nominal donasi adalah Rp 10.000. Batasan ini ditentukan agar transaksi dapat diproses secara efisien oleh jaringan perbankan dan payment gateway Midtrans Snap tanpa terpotong biaya minimum sistem.",
  },
  {
    question: "Bagaimana cara berdonasi secara anonim tanpa menampilkan nama?",
    answer:
      "Cukup aktifkan toggle 'Donasi sebagai Anonim' pada formulir. Nama Anda akan disamarkan menjadi 'Hamba Allah' pada rekapitulasi publik dan dinding doa, namun tetap tersimpan secara aman di sistem internal untuk keperluan verifikasi akuntansi posko.",
  },
  {
    question: "Ke mana dana donasi yang terkumpul dialokasikan?",
    answer:
      "Seluruh dana donasi dialokasikan untuk logistik regu pemadam darat (sepatu tahan api, pompa punggung, selang, masker respirator N95), pasokan oksigen serta obat pernapasan masyarakat terdampak kabut asap, serta rehabilitasi vegetasi lahan gambut.",
  },
  {
    question: "Apakah donatur mendapatkan bukti tanda terima pembayaran?",
    answer:
      "Ya. Setiap transaksi donasi yang berhasil secara otomatis menghasilkan nomor ID Pesanan unik. Jika Anda mencantumkan alamat email, salinan bukti tanda terima digital akan dikirimkan langsung ke email Anda.",
  },
  {
    question: "Bagaimana saya dapat memantau transparansi penggunaan dana donasi?",
    answer:
      "Anda dapat memantau akumulasi total donasi yang masuk secara real-time pada meteran beranda situs, serta memantau dokumentasi penyaluran barang dan kegiatan operasional relawan melalui menu Dokumentasi Aksi.",
  },
];

export function FaqDonasiCard() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Informasi & Ketentuan</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[var(--color-foreground)]">
          Pertanyaan Umum (FAQ)
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-secondary)] leading-relaxed">
          Pertanyaan yang paling sering diajukan seputar mekanisme donasi, transparansi, dan penyaluran bantuan di lapangan.
        </p>
      </div>

      {/* Accordion FAQ */}
      <div className="divide-y divide-[var(--color-border)]">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between gap-4 text-left font-semibold text-xs sm:text-sm text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="leading-snug">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--color-secondary)] shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[var(--color-primary)]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2.5 text-xs sm:text-sm text-[var(--color-secondary)] leading-relaxed animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="pt-4 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 text-xs text-[var(--color-secondary)]">
          <ShieldCheck className="w-4 h-4 text-[var(--color-success)] shrink-0" />
          <span>Transparansi audit terbuka</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-secondary)]">
          <HeartHandshake className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <span>100% untuk aksi kemanusiaan</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-secondary)]">
          <FileText className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
          <span>Laporan berkala dipublikasikan</span>
        </div>
      </div>
    </div>
  );
}
