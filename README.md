# Temanggung Peduli

Platform transparansi donasi, doa, dan dokumentasi penyaluran bantuan sosial untuk wilayah Temanggung.

---

## 1. Ringkasan Proyek & Tech Stack

Aplikasi ini dibangun menggunakan arsitektur modern berbasis Next.js App Router dengan pemisahan layer yang jelas (UI, Service, Repository, Database Adapter):

- **Framework**: Next.js 16 (App Router) & React 19
- **Bahasa**: TypeScript 5
- **Styling**: Tailwind CSS v4 & Motion
- **ORM & Database**: Prisma ORM 7 (`@prisma/adapter-pg`) dengan PostgreSQL (Supabase)
- **Payment Gateway**: Midtrans Snap API (QRIS, Bank Transfer, E-Wallet)
- **Storage**: Supabase Storage
- **Validasi Schema**: Zod 4

---

## 2. Prasyarat Sistem

Sebelum memulai instalasi, pastikan sistem Anda telah terpasang:

- **Node.js**: Versi 20.x atau lebih baru (LTS direkomendasikan)
- **Package Manager**: `npm` (bawaan Node.js), `pnpm`, atau `yarn`
- **Database**: Instance PostgreSQL aktif (dapat menggunakan Supabase atau PostgreSQL lokal)
- **Akun Midtrans**: Akun Midtrans (mode Sandbox untuk pengujian)

---

## 3. Langkah Instalasi & Setup

Ikuti panduan bertahap berikut setelah melakukan clone repository:

### Langkah 1: Clone Repository

```bash
git clone https://github.com/Aldikurniawan19/temanggung-peduli.git
cd temanggung-peduli
```

### Langkah 2: Instalasi Dependensi

Jalankan instalasi dependensi proyek:

```bash
npm install
```

> **Catatan**: Script `postinstall` akan otomatis menjalankan `prisma generate` untuk membangun Prisma Client ke direktori `src/generated/prisma`.

### Langkah 3: Konfigurasi Environment Variables

Salin file template `.env.example` menjadi `.env.local` (atau `.env`):

```bash
cp .env.example .env.local
```

Buka `.env.local` dan lengkapi konfigurasi variabel berikut:

| Variabel | Deskripsi | Contoh / Default |
|---|---|---|
| `DATABASE_URL` | URL koneksi PostgreSQL transaction pooler (port 6543 untuk Supabase) | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | URL koneksi langsung PostgreSQL (port 5432) untuk migrasi | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:5432/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | Endpoint URL project Supabase | `https://[ref].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon Key Supabase | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret Service Role Key Supabase | `eyJhbGci...` |
| `MIDTRANS_SERVER_KEY` | Server Key dari Midtrans Dashboard | `SB-Mid-server-xxx` |
| `MIDTRANS_CLIENT_KEY` | Client Key dari Midtrans Dashboard | `SB-Mid-client-xxx` |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`| Client Key untuk frontend Snap | `SB-Mid-client-xxx` |
| `MIDTRANS_IS_PRODUCTION` | Mode lingkungan Midtrans (`true` atau `false`) | `false` |
| `NEXT_PUBLIC_APP_URL` | URL dasar aplikasi | `http://localhost:3000` |
| `ADMIN_USERNAME` | Username login admin dashboard | `admin` |
| `ADMIN_PASSWORD` | Password login admin dashboard | Tentukan password yang aman |
| `ADMIN_SESSION_SECRET` | Kunci enkripsi cookie sesi admin (min. 32 karakter) | String rahasia acak panjang |

### Langkah 4: Sinkronisasi Skema Database

Dorong skema Prisma ke database PostgreSQL:

```bash
npm run db:push
```

### Langkah 5: Isi Data Awal (Opsional / Seeding)

Untuk mengisi data awal dummy (contoh donasi terverifikasi, doa publik, dan dokumentasi penyaluran), jalankan:

```bash
npm run db:seed
```

### Langkah 6: Jalankan Server Development

Mulai aplikasi di mode development:

```bash
npm run dev
```

Buka peramban (browser) dan akses alamat `http://localhost:3000`.

---

## 4. Daftar Perintah NPM

Berikut ringkasan perintah yang tersedia di `package.json`:

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan Next.js development server pada port 3000 |
| `npm run build` | Melakukan generate Prisma Client dan kompilasi build produksi Next.js |
| `npm run start` | Menjalankan server aplikasi produksi hasil build |
| `npm run lint` | Menjalankan ESLint untuk pemeriksaan kualitas dan format kode |
| `npm run db:push` | Melakukan sinkronisasi skema Prisma ke database |
| `npm run db:studio` | Membuka antarmuka web Prisma Studio untuk inspeksi data tabel |
| `npm run db:seed` | Menjalankan script pengisian data awal dummy (`prisma/seed.ts`) |

---

## 5. Konfigurasi Khusus Layanan

### A. Midtrans Payment Gateway

1. Masuk ke Dashboard Midtrans Sandbox di https://dashboard.sandbox.midtrans.com/
2. Buka menu **Settings** > **Configuration**.
3. Atur **Payment Notification URL** ke route webhook aplikasi:
   - Development (menggunakan tunneling seperti ngrok): `https://<domain-tunnel>/api/payment/notification`
   - Production: `https://<domain-aplikasi>/api/payment/notification`
4. Pastikan handler menerima payload dengan status `200 OK` agar status transaksi donasi terverifikasi secara real-time.

### B. Admin Dashboard

- Route login administrator berada di `/admin/login`.
- Masukkan nilai `ADMIN_USERNAME` dan `ADMIN_PASSWORD` sesuai konfigurasi environment.
- Sesi admin disimpan melalui cookie HTTP-only terenkripsi menggunakan kunci `ADMIN_SESSION_SECRET`.

---

## 6. Struktur Direktori Proyek

```
temanggung-peduli/
├── prisma/
│   ├── schema.prisma       # Definisi model data & konfigurasi database
│   └── seed.ts             # Script data seeder awal
├── public/                 # File aset statis (gambar, logo, dsb.)
├── src/
│   ├── app/                # App Router Next.js (halaman publik, admin, API endpoint)
│   ├── components/         # Komponen antarmuka reusable (layout, buttons, card)
│   ├── constants/          # Konstanta aplikasi
│   ├── features/           # Komponen dan logika spesifik per fitur
│   ├── generated/          # Output Prisma Client hasil generate
│   ├── lib/                # Konfigurasi library eksternal (Prisma, Midtrans, Supabase, Auth)
│   ├── repositories/       # Layer akses database & query
│   ├── services/           # Layer logika bisnis
│   ├── styles/             # File token warna dan tipografi terpusat (tokens.css)
│   └── types/              # Definisi interface & tipe TypeScript
├── .env.example            # Template konfigurasi environment variables
├── .gitignore              # Daftar file & folder yang diabaikan Git
├── next.config.ts          # Konfigurasi Next.js
├── package.json            # Definisi dependensi & script proyek
└── tsconfig.json           # Konfigurasi TypeScript compiler
```

---

## 7. Standar Kode & Deployment

- Sebelum membuat pull request atau push perubahan, jalankan `npm run lint` untuk memastikan kepatuhan standar kode.
- Saat melakukan deployment ke layanan cloud (misalnya Vercel):
  - Tambahkan seluruh pasangan key-value dari `.env.example` ke pengaturan Environment Variables di dashboard hosting.
  - Script build (`npm run build`) secara otomatis akan mengeksekusi `prisma generate` sebelum proses kompilasi Next.js dimulai.
