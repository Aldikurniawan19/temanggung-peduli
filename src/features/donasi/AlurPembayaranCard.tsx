import React from "react";
import { CreditCard, ArrowRight, ShieldCheck, QrCode, Smartphone, Building } from "lucide-react";

export function AlurPembayaranCard() {
  const steps = [
    {
      number: "1",
      title: "Tentukan Nominal Donasi",
      description: "Pilih nominal cepat yang disediakan atau masukkan nominal kustom yang Anda kehendaki (minimal Rp 10.000).",
    },
    {
      number: "2",
      title: "Isi Identitas atau Opsi Anonim",
      description: "Lengkapi nama dan email untuk bukti tanda terima, atau aktifkan toggle donasi anonim jika ingin nama disamarkan sebagai \"Hamba Allah\".",
    },
    {
      number: "3",
      title: "Pesan Dukungan (Opsional)",
      description: "Tuliskan doa atau kata penyemangat untuk warga terdampak dan para relawan pemadam karhutla di lapangan.",
    },
    {
      number: "4",
      title: "Selesaikan Pembayaran",
      description: "Klik tombol donasi untuk memproses pembayaran via QRIS, dompet digital, atau transfer virtual account secara langsung.",
    },
  ];

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
          <CreditCard className="w-4 h-4" />
          <span>Petunjuk Donasi</span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[var(--color-foreground)]">
          Alur Pembayaran Midtrans Snap
        </h3>
        <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
          Panduan langkah demi langkah menyalurkan bantuan secara aman, transparan, dan terverifikasi otomatis.
        </p>
      </div>

      {/* List Langkah */}
      <div className="space-y-3.5">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              {step.number}
            </div>
            <div className="space-y-0.5 text-xs sm:text-sm">
              <h4 className="font-semibold text-[var(--color-foreground)] leading-snug">
                {step.title}
              </h4>
              <p className="text-xs text-[var(--color-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Metode Pembayaran yang Didukung */}
      <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
        <div className="text-[11px] font-semibold text-[var(--color-secondary)] uppercase tracking-wider">
          Metode Pembayaran yang Didukung
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs text-[var(--color-foreground)] font-medium">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--color-background)] border border-[var(--color-border)]">
            <QrCode className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            QRIS (Semua E-Wallet)
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--color-background)] border border-[var(--color-border)]">
            <Smartphone className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            GoPay & ShopeePay
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--color-background)] border border-[var(--color-border)]">
            <Building className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            Virtual Account Bank
          </span>
        </div>
      </div>

      {/* Keamanan */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[11px] text-[var(--color-secondary)]">
        <ShieldCheck className="w-4 h-4 text-[var(--color-success)] shrink-0" />
        <span>Terenkripsi 256-bit dan terverifikasi secara real-time ke sistem posko.</span>
      </div>
    </div>
  );
}
