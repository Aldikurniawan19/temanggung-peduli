import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrayerForm } from "@/features/ucapan/PrayerForm";
import { PrayerWall } from "@/features/ucapan/PrayerWall";
import { MotionFadeIn } from "@/components/ui/Motion";
import * as ucapanService from "@/services/ucapan-service";
import type { PrayerPublic } from "@/types";

export const metadata: Metadata = {
  title: "Dinding Doa & Ucapan",
  description:
    "Kumpulan doa tulus dan kata penyemangat dari masyarakat Temanggung untuk para relawan dan warga terdampak karhutla di Kalimantan.",
};

export const dynamic = "force-dynamic";

export default async function UcapanPage() {
  let prayers: PrayerPublic[] = [
    {
      id: "prayer-1",
      name: "Siti Rahayu (Warga Temanggung)",
      message: "Kuat selalu untuk tim relawan gabungan di Kalimantan. Dedikasi kalian memadamkan bara gambut menjaga paru-paru dunia sangat kami hormati.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "prayer-2",
      name: "Ahmad Fauzi",
      message: "Semoga hujan lebat segera mengguyur daratan Kalimantan dan memadamkan bara api hingga ke lapisan tanah terdalam. Tetap utamakan keselamatan diri.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "prayer-3",
      name: "Komunitas Pemuda Temanggung",
      message: "Jarak pulau bukan penghalang empati kemanusiaan. Dari lereng Sindoro-Sumbing, kami kirimkan doa dan donasi terbaik untuk kawan-kawan di Kalimantan.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: "prayer-4",
      name: "Ibu Kartika & Keluarga",
      message: "Doa kami sekeluarga menyertai anak-anak dan warga Kalimantan yang berjuang menghadapi kepungan asap. Semoga musibah ini lekas tuntas.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: "prayer-5",
      name: "Relawan Kedu Tanggap Bencana",
      message: "Salam hormat untuk rekan-rekan relawan di posko lapangan Kalimantan. Bantuan logistik terus kami koordinasikan dari Temanggung.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: "prayer-6",
      name: "Hamba Allah",
      message: "Semoga donasi dan doa tulus ini meringankan beban operasional tim penembus kabut asap di pedalaman Kalimantan.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];

  try {
    const dbPrayers = await ucapanService.getPublicPrayers(30);
    if (dbPrayers && dbPrayers.length > 0) {
      prayers = dbPrayers;
    }
  } catch (err) {
    console.warn("[UcapanPage] Menggunakan doa kurasi awal:", err);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-10 sm:space-y-12">
      {/* Breadcrumb Navigation */}
      <MotionFadeIn direction="down" duration={0.3}>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#185334] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </MotionFadeIn>

      {/* Header Info */}
      <MotionFadeIn direction="up" delay={0.08} className="text-center max-w-2xl mx-auto space-y-3.5 sm:space-y-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Doa doa orang baik
        </h1>
      </MotionFadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Kolom Kiri: Form Kirim Doa */}
        <MotionFadeIn direction="up" delay={0.12} className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
          <PrayerForm />
        </MotionFadeIn>

        {/* Kolom Kanan: Dinding Doa */}
        <MotionFadeIn direction="up" delay={0.18} className="lg:col-span-7 xl:col-span-8 space-y-6">
          <PrayerWall prayers={prayers} />
        </MotionFadeIn>
      </div>
    </div>
  );
}
