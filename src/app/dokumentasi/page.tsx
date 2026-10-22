import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, HandHelping } from "lucide-react";
import { DocumentationGallery } from "@/features/dokumentasi/DocumentationGallery";
import { MotionFadeIn } from "@/components/ui/Motion";
import * as docService from "@/services/dokumentasi-service";
import type { DocumentationPublic } from "@/types";

export const metadata: Metadata = {
  title: "Dokumentasi Aksi & Penyaluran",
  description:
    "Laporan visual terbuka aksi penggalangan donasi di Temanggung dan dokumentasi penyaluran bantuan untuk penanganan karhutla di Kalimantan.",
};

export const revalidate = 60;

export default async function DokumentasiPage() {
  let items: DocumentationPublic[] = [
    {
      id: "doc-1",
      title: "Pengiriman Paket 500 Masker N95 & Oksigen Medis ke Posko Kalimantan",
      description: "Posko Temanggung Peduli memberangkatkan paket 500 unit masker respirator N95, pelindung mata, dan tabung oksigen untuk personil pemadam karhutla di Kalimantan.",
      type: "penyaluran",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
      eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-2",
      title: "Aksi Penggalangan Donasi Terbuka di Alun-Alun Temanggung",
      description: "Masyarakat dan komunitas pemuda Temanggung membuka posko donasi terbuka untuk menggalang kepedulian bagi korban kabut asap Kalimantan.",
      type: "galang_donasi",
      imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=800&q=80",
      eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-3",
      title: "Penyaluran Suplemen & Ransum Pangan untuk Regu Pemadam Gambut",
      description: "Penyaluran ransum makanan berenergi tinggi, susu steril, air mineral galon, dan multivitamin untuk para relawan pemadam yang bertugas di Kalimantan.",
      type: "penyaluran",
      imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
      eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-4",
      title: "Dukungan Obat-obatan & Tetes Mata untuk Warga Terdampak Asap",
      description: "Bantuan medis berupa vitamin pernapasan, tetes mata, dan inhaler disalurkan melalui mitra relawan medis setempat di desa lingkar gambut Kalimantan.",
      type: "penyaluran",
      imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
      eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-5",
      title: "Pentas Musik Amal Peduli Kalimantan di Pusat Kota Temanggung",
      description: "Penggalangan dana kolaboratif bertajuk 'Nada Temanggung untuk Rimba Kalimantan', seluruh hasil saweran disalurkan 100% ke rekening penanganan bencana.",
      type: "galang_donasi",
      imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
      eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-6",
      title: "Alokasi Dana Pemulihan untuk Bibit Reboisasi Gambut Kalimantan",
      description: "Sebagian dana donasi dialokasikan untuk penyediaan bibit pohon endemik rawa gambut dalam rangka rencana rehabilitasi pasca api padam.",
      type: "penyaluran",
      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
      createdAt: new Date().toISOString(),
    },
  ];

  try {
    const dbDocs = await docService.getPublicDocumentations({ limit: 30 });
    if (dbDocs && dbDocs.length > 0) {
      items = dbDocs;
    }
  } catch (err) {
    console.warn("[DokumentasiPage] Menggunakan dokumentasi awal:", err);
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
          Dokumentasi Aksi & Bukti Penyaluran
        </h1>

        <p className="text-xs sm:text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
          Setiap rupiah yang dititipkan masyarakat Temanggung dipertanggungjawabkan secara terbuka melalui arsip foto dan logistik lapangan di Kalimantan.
        </p>
      </MotionFadeIn>

      {/* Gallery with Tabs & Lightbox Modal */}
      <DocumentationGallery initialItems={items} />

      {/* Audit & Donation CTA Banner */}
      <MotionFadeIn
        direction="up"
        delay={0.1}
        className="p-6 sm:p-8 rounded-3xl bg-emerald-50/70 border border-emerald-100/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-center shrink-0 text-[#185334]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Transparansi & Akuntabilitas Penuh
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
              Seluruh bukti nota pembelian logistik, surat jalan, dan serah terima bantuan diarsipkan untuk audit terbuka publik.
            </p>
          </div>
        </div>

        <Link
          href="/donasi"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#185334] hover:bg-[#15462c] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all shrink-0"
        >
          <HandHelping className="w-4 h-4" />
          <span>Salurkan Bantuan Sekarang</span>
        </Link>
      </MotionFadeIn>
    </div>
  );
}
