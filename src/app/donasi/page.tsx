import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DonationForm } from "@/features/donasi/DonationForm";
import { AlurPembayaranCard } from "@/features/donasi/AlurPembayaranCard";
import { RekeningPoskoCard } from "@/features/donasi/RekeningPoskoCard";
import { FaqDonasiCard } from "@/features/donasi/FaqDonasiCard";
import { MotionFadeIn } from "@/components/ui/Motion";

export const metadata: Metadata = {
  title: "Salurkan Donasi Online",
  description:
    "Formulir donasi online cepat, aman, dan transparan dari Temanggung untuk penanggulangan karhutla Kalimantan via Midtrans Snap.",
};

export default function DonasiPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8 sm:space-y-12">
      {/* Breadcrumb Navigation */}
      <MotionFadeIn direction="down" duration={0.4}>
        <nav aria-label="Breadcrumb">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </nav>
      </MotionFadeIn>

      {/* Main Layout:
          - Mobile (< lg):
            1. Card Penjelasan Alur Pembayaran Midtrans Snap
            2. Rekening Resmi Posko
            3. Form Input Donasi
            4. Pertanyaan Umum (FAQ)
          - Desktop (lg):
            Kolom Kiri (col-span-7): Form Input Donasi
            Kolom Kanan (col-span-5): Alur Pembayaran Snap & Rekening Resmi Posko
            Bawah: Pertanyaan Umum (FAQ)
      */}
      <section className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Kolom Informasi & Petunjuk (Order-1 di Mobile, Kolom Kanan di Desktop) */}
        <div className="order-1 lg:order-2 lg:col-span-5 w-full space-y-6">
          <MotionFadeIn direction="up" delay={0.1}>
            <AlurPembayaranCard />
          </MotionFadeIn>

          <MotionFadeIn direction="up" delay={0.2}>
            <RekeningPoskoCard />
          </MotionFadeIn>
        </div>

        {/* Kolom Form Donasi (Order-2 di Mobile, Kolom Kiri di Desktop) */}
        <div className="order-2 lg:order-1 lg:col-span-7 w-full">
          <MotionFadeIn direction="up" delay={0.1}>
            <Suspense
              fallback={
                <div className="p-8 text-center text-xs text-[var(--color-secondary)] bg-white rounded-2xl border border-[var(--color-border)]">
                  Memuat formulir donasi...
                </div>
              }
            >
              <DonationForm />
            </Suspense>
          </MotionFadeIn>
        </div>
      </section>

      {/* Pertanyaan Umum (Order-3 di Mobile, Full-width di Bawah pada Desktop) */}
      <section className="w-full">
        <MotionFadeIn direction="up" delay={0.2}>
          <FaqDonasiCard />
        </MotionFadeIn>
      </section>
    </main>
  );
}
