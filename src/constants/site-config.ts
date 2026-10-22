export const SITE_CONFIG = {
  name: "Temanggung Peduli",
  tagline: "Solidaritas Karhutla Kalimantan",
  description: "Gerakan kemanusiaan dan kepedulian masyarakat Temanggung untuk membantu penanggulangan kebakaran hutan dan lahan serta perlindungan warga terdampak di Kalimantan.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://temanggungpeduli.id",
  ogImage: "/og-image.jpg",
  contact: {
    email: "kontak@temanggungpeduli.id",
    phone: "+62 812-3456-7890",
    address: "Posko Relawan Temanggung Peduli, Kabupaten Temanggung, Jawa Tengah",
  },
  social: {
    instagram: "https://instagram.com/temanggungpeduli",
  },
  navLinks: [
    { label: "Beranda", href: "/" },
    { label: "Donasi", href: "/#donasi" },
    { label: "Update", href: "/#update" },
    { label: "Doa & Pesan", href: "/ucapan" },
  ],
  nominalPresets: [25000, 50000, 100000, 250000, 500000],
} as const;
