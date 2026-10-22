import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { DonationProgressCard } from "@/components/home/DonationProgressCard";
import { QuickDonationWidget } from "@/components/home/QuickDonationWidget";
import { RecentDonationsSlider } from "@/components/home/RecentDonationsSlider";
import { RecentPrayersSlider } from "@/components/home/RecentPrayersSlider";
import { MotionFadeIn, MotionStagger, MotionCard } from "@/components/ui/Motion";
import { formatShortDate } from "@/lib/formatter";
import * as donasiService from "@/services/donasi-service";
import * as ucapanService from "@/services/ucapan-service";
import * as docService from "@/services/dokumentasi-service";
import type { DonationPublic, PrayerPublic, DocumentationPublic } from "@/types";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  let stats = { totalAmount: 125750000, donorCount: 1420, verifiedCount: 1420 };
  let recentDonations: DonationPublic[] = [
    {
      id: "demo-1",
      displayName: "Hamba Allah",
      amount: 500000,
      message: "Doa tulus dari Temanggung untuk saudara kita di Kalimantan. Semoga kabut asap lekas sirna.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "demo-2",
      displayName: "Bambang Sudiro",
      amount: 250000,
      message: "Salam hormat untuk seluruh relawan dan regu pemadam karhutla di pedalaman Kalimantan.",
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: "demo-3",
      displayName: "Hamba Allah",
      amount: 100000,
      message: "Sedikit bantuan untuk masker anak-anak dan logistik relawan gambut.",
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: "demo-4",
      displayName: "Keluarga Santoso (Kedu)",
      amount: 750000,
      message: "Semoga barokah dan segera turun hujan pembawa berkah bagi saudara di Kalimantan.",
      createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    {
      id: "demo-5",
      displayName: "Rina Kusuma",
      amount: 150000,
      message: "Tetap semangat kawan-kawan pejuang pemadam api gambut!",
      createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
    {
      id: "demo-6",
      displayName: "Alumni SMAN 1 Temanggung",
      amount: 1200000,
      message: "Donasi gabungan alumni untuk bantuan tabung oksigen dan logistik posko.",
      createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    },
  ];

  let recentPrayers: PrayerPublic[] = [
    {
      id: "prayer-1",
      name: "Siti Rahayu (Warga Temanggung)",
      message: "Kuat selalu untuk tim relawan gabungan di Kalimantan. Dedikasi kalian menjaga hutan dan paru-paru dunia sangat kami hormati.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "prayer-2",
      name: "Ahmad Fauzi",
      message: "Semoga hujan lebat segera mengguyur daratan Kalimantan, memadamkan bara gambut hingga lapisan terdalam.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "prayer-3",
      name: "Komunitas Pemuda Temanggung",
      message: "Jarak pulau bukan penghalang persaudaraan. Kami dari Temanggung siap terus mendukung saudara kita di Kalimantan.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: "prayer-4",
      name: "Dr. Hendra Saputra",
      message: "Jaga kesehatan saluran pernapasan para pejuang di garis depan. Masker dan oksigen sudah dalam perjalanan.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: "prayer-5",
      name: "Ibu Nurhayati (Parakan)",
      message: "Doa terbaik dari kami ibu-ibu pengajian Temanggung untuk keselamatan warga dan anak-anak terdampak asap.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
    },
    {
      id: "prayer-6",
      name: "Relawan Lindungi Hutan",
      message: "Semangat pantang surut! Rimba Kalimantan adalah warisan nusantara yang harus kita pertahankan bersama.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
  ];

  let recentDocs: DocumentationPublic[] = [
    {
      id: "doc-1",
      title: "Tim Relawan Mulai Pemadaman di Kalimantan",
      description: "Relawan posko gabungan diterjunkan langsung memadamkan titik api bara gambut di pedalaman Kalimantan.",
      type: "galang_donasi",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      eventDate: "2025-10-12T00:00:00.000Z",
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-2",
      title: "Penyaluran Masker dan Obat untuk Warga Terdampak",
      description: "Distribusi ribuan masker medis N95, tabung oksigen portabel, dan obat tetes mata untuk warga di pemukiman terkepung asap.",
      type: "penyaluran",
      imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      eventDate: "2025-10-08T00:00:00.000Z",
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-3",
      title: "Reboisasi di Area Pasca Kebakaran",
      description: "Penanaman bibit pohon endemik rawa gambut sebagai langkah pemulihan ekosistem jangka panjang pasca kebakaran.",
      type: "penyaluran",
      imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      eventDate: "2025-10-05T00:00:00.000Z",
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    const [dbStats, dbDonations, dbPrayers, dbDocs] = await Promise.allSettled([
      donasiService.getDonationSummaryStats(),
      donasiService.getPublicDonations(10),
      ucapanService.getPublicPrayers(10),
      docService.getPublicDocumentations({ limit: 3 }),
    ]);

    if (dbStats.status === "fulfilled" && dbStats.value.totalAmount > 0) {
      stats = dbStats.value;
    }
    if (dbDonations.status === "fulfilled" && dbDonations.value.length > 0) {
      recentDonations = dbDonations.value;
    }
    if (dbPrayers.status === "fulfilled" && dbPrayers.value.length > 0) {
      recentPrayers = dbPrayers.value;
    }
    if (dbDocs.status === "fulfilled" && dbDocs.value.length > 0) {
      recentDocs = dbDocs.value;
    }
  } catch (err) {
    console.warn("[HomePage] Menggunakan data kurasi awal:", err);
  }

  // Target Donasi
  const targetDonation = 250000000; // Rp 250.000.000 Target Sesuai Mockup
  const currentTotal = stats.totalAmount > 0 ? stats.totalAmount : 125750000;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section Sesuai Mockup */}
      <HeroSection
        totalAmount={currentTotal}
        donorCount={stats.donorCount > 0 ? stats.donorCount : 1420}
        targetAmount={targetDonation}
      />

      {/* 2. Progres Donasi & Widget Donasi Cepat */}
      <section id="donasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Kolom Kiri: Progres Donasi */}
          <MotionFadeIn direction="up" delay={0.05} className="lg:col-span-7">
            <DonationProgressCard
              currentAmount={currentTotal}
              targetAmount={targetDonation}
              donorCount={stats.donorCount > 0 ? stats.donorCount : 1420}
              verifiedCount={stats.verifiedCount}
            />
          </MotionFadeIn>

          {/* Kolom Kanan: Card Widget Donasi Cepat */}
          <MotionFadeIn direction="up" delay={0.15} className="lg:col-span-5">
            <QuickDonationWidget />
          </MotionFadeIn>
        </div>
      </section>

      {/* 3. Update Terkini (Dokumentasi Penyaluran) */}
      <section id="update" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        {/* Header Seksi */}
        <MotionFadeIn direction="up" className="space-y-3 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Update Terkini
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Ikuti perkembangan penyaluran donasi dan kegiatan penanggulangan karhutla di berbagai wilayah.
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <Link
              href="/dokumentasi"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#185334] hover:underline transition-colors"
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </MotionFadeIn>

        {/* 3 Kartu Berita / Kegiatan Update Terkini */}
        <MotionStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentDocs.slice(0, 3).map((item, idx) => {
            const badgeLabel = idx === 0 ? "Kegiatan" : "Berita";
            return (
              <MotionCard key={item.id} className="h-full">
                <Link
                  href="/dokumentasi"
                  className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full"
                >
                  {/* Image Aspect Box */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      unoptimized={item.imageUrl.startsWith("data:")}
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EBF5EF] text-[#185334] font-semibold text-[11px] mb-2.5">
                        {badgeLabel}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#185334] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <div className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-50">
                      {formatShortDate(item.eventDate)}
                    </div>
                  </div>
                </Link>
              </MotionCard>
            );
          })}
        </MotionStagger>
      </section>

      {/* 4. Donatur Terbaru Slider Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecentDonationsSlider donations={recentDonations} />
      </div>

      {/* 5. Dinding Doa Slider Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecentPrayersSlider prayers={recentPrayers} />
      </div>
    </div>
  );
}
