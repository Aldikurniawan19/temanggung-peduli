import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, HelpCircle, Building2, CreditCard, Heart } from "lucide-react";
import { DonationForm } from "@/features/donasi/DonationForm";
import { MotionFadeIn } from "@/components/ui/Motion";
import { SITE_CONFIG } from "@/constants/site-config";

export const metadata: Metadata = {
  title: "Salurkan Donasi Online",
  description:
    "Formulir donasi online cepat, aman, dan transparan dari Temanggung untuk penanggulangan karhutla Kalimantan via Midtrans Snap.",
};

export default function DonasiPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb Navigation */}
      <MotionFadeIn direction="down" duration={0.4}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </MotionFadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Kolom Kiri: Form Donasi */}
        <MotionFadeIn direction="up" delay={0.1} className="lg:col-span-7">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Memuat formulir donasi...</div>}>
            <DonationForm />
          </Suspense>
        </MotionFadeIn>

        {/* Kolom Kanan: Panduan & Informasi Posko */}
        <MotionFadeIn direction="up" delay={0.2} className="lg:col-span-5 space-y-8">
          {/* Card Cara Kerja Pembayaran */}
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[var(--color-foreground)] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Alur Pembayaran Midtrans Snap</span>
            </h3>

            <ol className="space-y-3 text-xs sm:text-sm text-[var(--color-secondary)] list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-[var(--color-foreground)] font-semibold">Tentukan Nominal:</strong> Pilih nominal preset atau masukkan jumlah kustom yang Anda kehendaki.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)] font-semibold">Opsi Anonim:</strong> Aktifkan toggle jika ingin nama Anda disamarkan sebagai &ldquo;Hamba Allah&rdquo; di daftar publik.
              </li>
              <li>
                <strong className="text-[var(--color-foreground)] font-semibold">Bayar via Snap:</strong> Klik tombol lanjut untuk membuka jendela Midtrans dan pilih metode pembayaran (QRIS, GoPay, Virtual Account Bank).
              </li>
              <li>
                <strong className="text-[var(--color-foreground)] font-semibold">Verifikasi Otomatis:</strong> Donasi langsung tercatat dan total donasi di beranda terakumulasi secara real-time.
              </li>
            </ol>
          </div>

          {/* Rekening Transfer Langsung (Alternatif Manual) */}
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Rekening Posko Resmi</span>
            </div>

            <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
              Bagi instansi atau perorangan yang ingin melakukan transfer bank secara langsung:
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <div className="text-xs text-[var(--color-secondary)]">Bank Jateng (BPD)</div>
                <div className="font-mono font-bold text-base text-[var(--color-foreground)]">
                  2-019-28192-1
                </div>
                <div className="text-xs text-[var(--color-foreground)] font-medium">
                  a.n. Posko Relawan Peduli Temanggung
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--color-background)] border border-[var(--color-border)]">
                <div className="text-xs text-[var(--color-secondary)]">Bank Mandiri</div>
                <div className="font-mono font-bold text-base text-[var(--color-foreground)]">
                  136-00-1928374-9
                </div>
                <div className="text-xs text-[var(--color-foreground)] font-medium">
                  a.n. Peduli Karhutla Temanggung
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Singkat */}
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-[var(--color-foreground)] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Pertanyaan Umum</span>
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-[var(--color-secondary)]">
              <div>
                <span className="font-semibold text-[var(--color-foreground)] block">
                  Berapa batas minimal donasi?
                </span>
                <span>Minimal donasi adalah Rp 10.000 agar dapat diproses oleh sistem payment gateway.</span>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <span className="font-semibold text-[var(--color-foreground)] block">
                  Apakah donasi anonim tetap dicatat?
                </span>
                <span>Ya, nama asli dan bukti transaksi tetap tersimpan di database untuk keperluan rekap audit admin, namun nama di layar publik otomatis diubah menjadi &ldquo;Hamba Allah&rdquo;.</span>
              </div>
            </div>
          </div>
        </MotionFadeIn>
      </div>
    </div>
  );
}
