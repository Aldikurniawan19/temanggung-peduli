import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/temanggung_peduli?schema=public";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Menjalankan seed data Temanggung Peduli...");

  // 1. Seed Donasi
  const donasi1 = await prisma.donation.create({
    data: {
      donorName: "Hamba Allah",
      donorEmail: "anonim1@example.com",
      isAnonymous: true,
      amount: 500000,
      message: "Semoga saudara kita di lereng selalu dilindungi dan api lekas padam.",
      isVerified: true,
      transaction: {
        create: {
          orderId: "DON-1700000001-A1B2C3",
          grossAmount: 500000,
          status: "settlement",
          paymentType: "qris",
          transactionTime: new Date(),
        },
      },
    },
  });

  const donasi2 = await prisma.donation.create({
    data: {
      donorName: "Bambang Sudiro",
      donorEmail: "bambang.sudiro@example.com",
      isAnonymous: false,
      amount: 250000,
      message: "Salam hormat untuk tim pemadam gabungan BPBD dan relawan.",
      isVerified: true,
      transaction: {
        create: {
          orderId: "DON-1700000002-D4E5F6",
          grossAmount: 250000,
          status: "settlement",
          paymentType: "bank_transfer",
          transactionTime: new Date(),
        },
      },
    },
  });

  // 2. Seed Doa & Ucapan
  await prisma.prayer.createMany({
    data: [
      {
        name: "Siti Rahayu",
        message:
          "Kuat selalu untuk tim relawan gabungan di lereng Gunung Sumbing dan Sindoro. Dedikasi kalian luar biasa menjaga paru-paru Jawa Tengah.",
        isApproved: true,
      },
      {
        name: "Ahmad Fauzi",
        message:
          "Semoga hujan segera turun membasahi bumi Temanggung dan memadamkan bara api hingga ke lapisan tanah terdalam.",
        isApproved: true,
      },
      {
        name: "Relawan Magelang Bersatu",
        message:
          "Kami dari posko perbatasan siap mendukung logistik dan armada jika dibutuhkan.",
        isApproved: true,
      },
      {
        name: "Warga Kaloran",
        message: "Semoga seluruh regu pemadam selalu dalam lindungan Tuhan Yang Maha Esa.",
        isApproved: false, // Pending moderation
      },
    ],
  });

  // 3. Seed Dokumentasi
  await prisma.documentation.createMany({
    data: [
      {
        title: "Penyaluran Masker N95 dan Oksigen Portabel untuk Relawan Hutan",
        description:
          "Tim posko gabungan mendistribusikan 200 unit masker respirator N95, pelindung mata, dan tabung oksigen untuk personil pemadam di lereng atas.",
        type: "penyaluran",
        imageUrl:
          "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
        eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      },
      {
        title: "Aksi Penggalangan Donasi Terbuka di Alun-Alun Temanggung",
        description:
          "Relawan muda dan komunitas penggiat alam membuka posko edukasi pencegahan karhutla serta penerimaan donasi langsung publik.",
        type: "galang_donasi",
        imageUrl:
          "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=800&q=80",
        eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      },
      {
        title: "Dropping Logistik Makanan Siap Santap dan Suplemen Vitamin",
        description:
          "Pengiriman logistik ransum berenergi tinggi, air mineral galon, dan multivitamin untuk 50 relawan pemadam yang bermalam di pos siaga atas.",
        type: "penyaluran",
        imageUrl:
          "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
        eventDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
    ],
  });

  console.log("Seed data berhasil dimasukkan!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
