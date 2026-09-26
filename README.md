# RaUrus (Catat Kilat Berbasis AI) ⚡️📱

> **Mobile-First Zero-Cost Personal Finance Tracker** dengan Natural Language AI via OpenRouter & Supabase Postgres.

---

## 📌 Daftar Isi
1. [Fitur Utama](#-fitur-utama)
2. [Tech Stack](#-tech-stack)
3. [Prasyarat](#-prasyarat)
4. [Langkah 1: Clone Repositori](#1-clone-repositori)
5. [Langkah 2: Setup Database Supabase](#2-setup-database-supabase)
6. [Langkah 3: Setup OpenRouter AI](#3-setup-openrouter-ai)
7. [Langkah 4: Konfigurasi Environment Variables](#4-konfigurasi-environment-variables)
8. [Langkah 5: Jalankan di Lokal](#5-jalankan-di-lokal)
9. [Langkah 6: Deploy ke Vercel](#6-deploy-ke-vercel)
10. [Fitur PWA (Mobile Standalone)](#-fitur-pwa-mobile-standalone)
11. [Struktur Direktori](#-struktur-direktori)
12. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🚀 Fitur Utama
- **Natural Language Parsing**: Ketik *"Beli bensin 25k bayar pake gopay"* atau *"Gajian kantor 8jt masuk bca"* langsung otomatis terekstrak nominal, kategori, tipe, dan metode bayar.
- **Dedicated AI Financial Assistant**: Chat interaktif dengan AI untuk cek pengeluaran, evaluasi keuangan bulanan, dan tips hemat.
- **Statistik & Visualisasi Keuangan**: Breakdown pengeluaran/pemasukan dengan Recharts (Ringkasan Kas, Distribusi Kategori, dan Tren Finansial).
- **Riwayat & Manajemen Transaksi**: Filter berdasarkan tipe (Semua, Masuk, Keluar), pencarian transaksi, dan modal edit/hapus transaksi.
- **Tema Gelap & Terang (Emerald / Slate)**: Dual theme elegan, responsif, dan kontras tajam.
- **Mobile PWA Ready**: Tampilan aplikasi native di Android/iOS via *"Add to Home Screen"*.

---

## 🛠 Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + [React 19](https://react.dev/)
- **Package Manager**: [Bun](https://bun.sh/) *(direkomendasikan)* atau Yarn
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Shadcn/UI Primitive + Lucide Icons
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + Client SDK)
- **AI Engine**: [OpenRouter API](https://openrouter.ai/) (Zero-cost free model: `z-ai/glm-5.2:free` dengan auto-fallback)
- **Visualisasi Data**: [Recharts](https://recharts.org/)
- **State & Data Fetching**: TanStack React Query v5

---

## 📋 Prasyarat
Sebelum mulai, pastikan Anda telah menyiapkan:
1. **Bun** (versi 1.1+) terpasang di komputer Anda ([Instal Bun](https://bun.sh/)). Jika belum ada Bun, bisa gunakan Node.js v20+ & Yarn.
2. **Git** terpasang.
3. Akun [Supabase](https://supabase.com/) (Gratis).
4. Akun [OpenRouter](https://openrouter.ai/) (Gratis untuk ambil API Key model free).
5. Akun [GitHub](https://github.com/) & [Vercel](https://vercel.com/) untuk deployment.

---

## 1. Clone Repositori

Clone repositori ini ke komputer lokal Anda:

```bash
# Clone repository
git clone https://github.com/JackBerck/raurus.git

# Masuk ke direktori proyek
cd raurus
```

Install dependensi menggunakan Bun:

```bash
bun install
```
*(Atau jika menggunakan Yarn: `yarn install`)*

---

## 2. Setup Database Supabase

1. Buka dashboard [Supabase](https://supabase.com/dashboard) dan buat proyek baru (*New Project*).
2. Tentukan nama proyek (misal: `raurus-db`) dan password database yang aman.
3. Setelah database siap, buka menu **SQL Editor** di sidebar kiri Supabase.
4. Salin seluruh isi skrip SQL dari file [`supabase/schema.sql`](./supabase/schema.sql) pada repositori ini.
5. Tempelkan (*paste*) ke dalam SQL Editor Supabase, lalu klik tombol **Run**.
   Skrip ini akan otomatis membuat:
   - Tabel `categories` beserta data kategori bawaan (Makanan, Transportasi, Gaji, dll.).
   - Tabel `providers` beserta metode bayar bawaan (Tunai, BCA, Mandiri, GoPay, OVO, dll.).
   - Tabel `transactions` beserta index untuk performa query cepat.
   - Kebijakan Row Level Security (RLS) untuk akses publik anonim.
6. Ambil konfigurasi API Supabase:
   - Masuk ke menu **Project Settings** > **API**.
   - Catat **Project URL** (`https://xyzcompany.supabase.co`).
   - Catat **anon public API Key** (`eyJhbGciOi...`).

---

## 3. Setup OpenRouter AI

1. Buka [OpenRouter](https://openrouter.ai/) dan lakukan login/registrasi.
2. Masuk ke halaman **Keys** ([openrouter.ai/settings/keys](https://openrouter.ai/settings/keys)) lalu klik **Create Key**.
3. Beri nama kunci (misal: `raurus-key`) dan salin token API Key yang muncul.
4. Model default yang digunakan adalah `z-ai/glm-5.2:free`. Model ini sepenuhnya gratis dan mendukung pemahaman Bahasa Indonesia secara alami.

---

## 4. Konfigurasi Environment Variables

Salin template file `.env.example` menjadi `.env.local` (atau `.env`):

```bash
cp .env.example .env.local
```

Buka file `.env.local` lalu isi dengan nilai kredensial yang telah Anda dapatkan pada Langkah 2 dan 3:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter AI Configuration
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=z-ai/glm-5.2:free
```

---

## 5. Jalankan di Lokal

Jalankan server development lokal:

```bash
bun dev
```
*(Atau `yarn dev`)*

Buka browser Anda di:
```text
http://localhost:3000
```

### Pengujian Fitur Lokal:
1. **Catat Cepat**: Masuk ke menu Beranda, klik tombol *"Catat Cepat via AI"*, ketik *"Beli makan siang nasi padang 25000 tunai"*, lalu kirim.
2. **AI Chat**: Buka tab AI di menu navigasi bawah, tanyakan *"Berapa total pengeluaranku hari ini?"* atau mintalah saran anggaran.
3. **Riwayat & Edit**: Buka tab Aktivitas, klik salah satu transaksi untuk melihat detail, mengedit nominal/kategori, atau menghapus transaksi.
4. **Dark/Light Mode**: Buka menu Pengaturan, ganti tema ke Mode Terang (Slate) atau Mode Gelap (Emerald).

---

## 6. Deploy ke Vercel

### Langkah A: Push Kode ke GitHub
Pastikan perubahan lokal Anda sudah di-commit dan di-push ke repositori GitHub:

```bash
git add .
git commit -m "feat: setup raurus production ready"
git push origin master
```

### Langkah B: Import Proyek di Vercel
1. Masuk ke dashboard [Vercel](https://vercel.com/dashboard).
2. Klik **Add New...** > **Project**.
3. Hubungkan akun GitHub Anda dan pilih repositori `raurus`.
4. Vercel akan otomatis mendeteksi framework **Next.js**.

### Langkah C: Tambahkan Environment Variables di Vercel
Sebelum menekan tombol Deploy, buka bagian **Environment Variables** di Vercel dan tambahkan 4 variabel berikut:

| Key | Value | Catatan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Dari Project Settings Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJh...` | Public Anon Key Supabase |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | Token dari OpenRouter |
| `OPENROUTER_MODEL` | `z-ai/glm-5.2:free` | Model AI free tier |

### Langkah D: Klik Deploy
Klik **Deploy**. Tunggu proses build selesai (~1-2 menit). Setelah selesai, Vercel akan memberikan domain aktif seperti:
```text
https://raurus.vercel.app
```

---

## 📱 Fitur PWA (Mobile Standalone)

Aplikasi ini telah dilengkapi dengan konfigurasi PWA (`manifest.webmanifest`, meta viewport rigid, anti-scroll bounce).

Untuk memasangnya di Smartphone seperti aplikasi native:
- **Android (Chrome / Brave / Edge)**:
  1. Buka URL deploy Vercel di browser HP.
  2. Ketuk ikon titik tiga (Menu) di kanan atas.
  3. Pilih **"Tambahkan ke Layar Utama" (Add to Home screen)** atau **"Instal Aplikasi"**.
- **iOS (Safari)**:
  1. Buka URL deploy Vercel di Safari.
  2. Ketuk tombol **Share** (kotak dengan panah ke atas) di bagian bawah.
  3. Pilih **"Add to Home Screen" (Tambah ke Layar Utama)**.

---

## 📁 Struktur Direktori

```text
raurus/
├── public/                 # Favicon, ikon PWA, assets statis
│   ├── icon.svg
│   └── manifest.webmanifest
├── src/
│   ├── app/                # Next.js App Router (Layout & API Routes)
│   │   ├── api/
│   │   │   ├── ai/chat/    # Endpoint AI Financial Assistant
│   │   │   ├── ai/parse/   # Endpoint Natural Language Transaction Parser
│   │   │   ├── categories/ # Endpoint CRUD Kategori
│   │   │   ├── providers/  # Endpoint CRUD Metode Pembayaran
│   │   │   └── transactions/# Endpoint CRUD Transaksi
│   │   ├── layout.tsx      # Root HTML & Fonts (Poppins)
│   │   └── page.tsx        # Single-page Shell Container
│   ├── components/
│   │   ├── layout/         # Header, Bottom Navigation, Mobile Shell
│   │   ├── providers/      # Theme Provider & React Query Provider
│   │   ├── ui/             # Reusable UI Components (Dialog, Card, Button, Input)
│   │   └── views/          # Halaman Aplikasi (Beranda, Aktivitas, AI Chat, Statistik, Pengaturan)
│   ├── hooks/              # Custom Hooks React Query (useTransactions, useCategories, dll.)
│   └── lib/                # Konfigurasi Supabase Client & Utilities
├── supabase/
│   └── schema.sql          # Skrip DDL Database, Index, Seed Data & RLS
├── .env.example            # Contoh Environment Variables
├── bun.lock                # Lockfile dependensi Bun
└── package.json            # Daftar dependencies & npm scripts
```

---

## ❓ Troubleshooting & FAQ

1. **AI Chat / Parser lambat atau pending lama?**
   - Periksa apakah kuota free model OpenRouter sedang sibuk atau limit sementara. Anda dapat mengganti `OPENROUTER_MODEL` di file `.env` dengan model gratis lainnya dari [OpenRouter Free Models](https://openrouter.ai/models?max_price=0) (seperti `deepseek/deepseek-chat:free` atau `google/gemini-2.0-flash-lite-preview-02-05:free`).
2. **Error `Failed to fetch transactions` saat pertama kali run?**
   - Pastikan Anda sudah menjalankan seluruh skrip [`supabase/schema.sql`](./supabase/schema.sql) di Supabase SQL Editor.
   - Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah terisi dengan benar.
3. **Tampilan overflow atau ikut ter-scroll saat keyboard HP terbuka?**
   - Layout aplikasi telah diproteksi dengan `fixed inset-0 overflow-hidden` pada root shell dan container scroll independen untuk tiap view, menjaga bottom navigation tetap stabil di posisi bawah.

---

## 📄 Lisensi
Proyek ini bersifat open-source dan bebas digunakan untuk kebutuhan pengelolaan keuangan personal.
