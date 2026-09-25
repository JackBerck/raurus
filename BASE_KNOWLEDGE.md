# Base Knowledge — Web App Pencatat Pengeluaran/Pemasukan Harian

> Dokumen ini adalah acuan (base knowledge) teknis & non-teknis untuk membangun aplikasi web mobile-first pencatat keuangan harian dengan input berbasis AI natural language. Ditulis agar bisa langsung dipakai sebagai konteks di chat Antigravity.

---

## 1. Ringkasan Proyek

**Nama sementara:** `RaUrus` 

**Deskripsi singkat:**
Web app personal finance tracker, dioptimalkan untuk tampilan mobile (mobile-first, terasa seperti native app meski dibuka lewat browser/PWA). Fokus utama: mencatat pengeluaran & pemasukan harian secepat mungkin lewat satu tombol input berbasis AI, lalu menampilkan log aktivitas dan ringkasan (chart/table) yang bisa difilter harian/mingguan/bulanan.

**Inspirasi UX:** Dana, GoPay, OVO — bottom navigation, log transaksi dikelompokkan per hari, tampilan bersih dan cepat dibaca.

**Prinsip desain:**
- Modern, minimalist, profesional
- Input transaksi harus **secepat mungkin** — cukup satu kalimat bebas, AI yang mengurus struktur data
- Semua komponen visual konsisten (pakai satu design system: shadcn/ui)
- Dark mode hijau (Supabase/Vercel vibe) sebagai default, ada opsi tema slate/putih

---

## 2. Tech Stack (Target Biaya: Rp0 / Gratis)

| Layer | Tools | Alasan |
|---|---|---|
| Framework | **Next.js** (App Router) | Free hosting optimal di Vercel, mendukung server actions, SSR/ISR |
| Hosting | **Vercel** (Free/Hobby plan) | Deploy langsung dari GitHub, gratis untuk personal project |
| Database + Auth | **Supabase** (Free tier) | Postgres gratis, Auth bawaan, Row Level Security, realtime jika dibutuhkan |
| AI Provider | **OpenRouter API** | Akses banyak model termasuk yang gratis (`z-ai/glm-5.2:free` atau alternatif free lain) |
| UI Components | **shadcn/ui** | Komponen siap pakai (accessible, customizable via Tailwind) |
| Styling | **Tailwind CSS** | Basis dari shadcn, mudah untuk theming dark/light |
| Charting | **Recharts** atau **Tremor** | Gratis, ringan, cocok untuk dashboard finance |
| State/Fetching | **TanStack Query (React Query)** | Sinkronisasi data client-server yang rapi |
| Form Validation | **Zod** + **React Hook Form** | Validasi input sebelum ke DB (opsional, untuk form manual/edit) |
| PWA (opsional) | **next-pwa** | Supaya bisa "Add to Home Screen" dan terasa app-like |

**Catatan batas gratis (penting untuk dipantau):**
- Supabase Free: 500MB DB, 5GB bandwidth/bulan, project auto-pause jika idle 7 hari (perlu di-ping/warm-up kalau jarang dipakai)
- Vercel Hobby: cukup untuk personal use, ada batas function execution time & bandwidth bulanan
- OpenRouter free models: ada rate limit per menit/hari, response time/model quality bisa lebih rendah dari model berbayar — perlu fallback strategy (lihat bagian 7)

---

## 3. Struktur Navigasi (Bottom Navigation)

Layout 5 slot, meniru pola app finance populer:

```
[ Beranda ]  [ Log Aktivitas ]   ( + AI )   [ Statistik ]  [ Pengaturan ]
     kiri-luar        kiri-dalam   tengah      kanan-dalam    kanan-luar
```

- **Tengah (paling besar, floating, elevated):** Tombol bulat dengan ikon bintang (✦ ala logo AI/Gemini). Satu-satunya pintu masuk untuk input transaksi baru. Tap → buka input sheet/modal dengan text field besar + mic (opsional voice-to-text nanti).
- **Kiri-dalam — Beranda:** Dashboard ringkasan (saldo, chart, ringkasan periode).
- **Kiri-luar — Log Aktivitas:** List transaksi, dikelompokkan per tanggal, bisa difilter.
- **Kanan-dalam — Pengaturan:** Tema, kategori custom, metode pembayaran/provider, profil.
- **Kanan-luar — belum ditentukan.** Rekomendasi (pilih salah satu, atau gabungkan sebagai satu halaman):
  1. **Statistik/Analisis** — insight lebih dalam (tren pengeluaran per kategori, perbandingan bulan ke bulan, top spending). *Rekomendasi utama*, karena beranda biasanya cuma ringkasan cepat, sedangkan tab ini bisa jadi tempat analisis mendalam.
  2. **Dompet/Akun** — kelola saldo per provider (cash, DANA, GoPay, BRI) seperti multi-wallet, berguna kalau nanti mau tracking saldo per akun, bukan cuma total.
  3. **Anggaran (Budget)** — set target bulanan per kategori, progress bar sisa budget.

  Saran: mulai dari opsi 1 (Statistik) karena paling natural melengkapi Beranda, opsi 2 & 3 bisa jadi fitur lanjutan (v2).

---

## 4. Alur Input via AI (Fitur Inti)

### 4.1 User Flow
1. User tap tombol tengah (✦)
2. Muncul bottom sheet dengan text input besar + placeholder contoh: *"contoh: beli bensin 10rb pake cash"*
3. User ketik bebas, misal: `"barusan beli bensin 10k bayar kes"`
4. Request dikirim ke server action / API route → diteruskan ke OpenRouter
5. AI mengembalikan JSON terstruktur sesuai skema DB (lihat bagian 5)
6. Tampilkan **preview/konfirmasi** hasil parsing ke user sebelum disimpan (penting! supaya user bisa koreksi kalau AI salah tangkap, misal kategori atau nominal keliru)
7. User tap "Simpan" → insert ke Supabase → muncul otomatis di Log Aktivitas & mempengaruhi ringkasan di Beranda

### 4.2 Contoh System Prompt untuk AI Parser

```
Kamu adalah parser transaksi keuangan. Ubah kalimat bebas berbahasa Indonesia
menjadi JSON transaksi sesuai skema berikut. Jika informasi tidak disebutkan,
gunakan nilai default yang masuk akal atau null.

Skema output (WAJIB hanya JSON, tanpa teks lain):
{
  "type": "expense" | "income",
  "title": string,          // ringkasan singkat, misal "Beli bensin"
  "description": string,    // opsional, detail tambahan
  "amount": number,          // nominal per unit
  "quantity": number,        // default 1 jika tidak disebutkan
  "total": number,           // amount * quantity, atau nominal total jika disebutkan langsung
  "category": string,        // pilih dari daftar kategori yang ada, atau "Lainnya"
  "provider": string,        // metode pembayaran: "cash", "dana", "gopay", "bri", dll
  "occurred_at": string      // ISO datetime, default waktu sekarang jika tidak disebutkan
}

Daftar kategori yang tersedia: {daftar_kategori_user}
Daftar provider yang tersedia: {daftar_provider_user}

Interpretasi angka: "10k" / "10rb" = 10000, "1jt" = 1000000, dst.
```

### 4.3 Fallback & Error Handling
- Jika model gratis OpenRouter timeout/limit → fallback ke model gratis kedua (siapkan 2-3 kandidat model gratis)
- Jika AI gagal parsing (JSON invalid) → tampilkan pesan error ramah + tombol "isi manual" (form biasa sebagai cadangan)
- Selalu validasi ulang response AI dengan Zod schema sebelum ditampilkan sebagai preview

---

## 5. Struktur Database (Supabase / Postgres)

### 5.1 Tabel `transactions`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (PK) | default `gen_random_uuid()` |
| `user_id` | uuid (FK → auth.users) | untuk RLS, siapa pemilik data |
| `type` | text (`expense` / `income`) | enum sederhana |
| `title` | text | judul singkat transaksi |
| `description` | text (nullable) | detail tambahan |
| `amount` | numeric | nominal per unit |
| `quantity` | numeric | default 1 |
| `total` | numeric | amount × quantity (bisa dihitung otomatis via trigger/generated column) |
| `category_id` | uuid (FK → categories) | kategori transaksi |
| `provider_id` | uuid (FK → providers) | metode pembayaran |
| `occurred_at` | timestamptz | tanggal & waktu transaksi terjadi |
| `created_at` | timestamptz | default `now()` |
| `raw_input` | text (nullable) | simpan teks asli dari user (untuk audit/debug parsing AI) |

### 5.2 Tabel `categories`
| Kolom | Tipe |
|---|---|
| `id` | uuid (PK) |
| `user_id` | uuid (FK, nullable jika mau ada default global) |
| `name` | text (misal: "Makanan", "Transportasi", "Gaji") |
| `type` | text (`expense` / `income` / `both`) |
| `icon` | text (nama ikon, opsional) |
| `color` | text (hex, opsional untuk chart) |

### 5.3 Tabel `providers`
| Kolom | Tipe |
|---|---|
| `id` | uuid (PK) |
| `user_id` | uuid (FK, nullable) |
| `name` | text (misal: "Cash", "DANA", "GoPay", "BRI") |
| `icon` | text (opsional) |
| `is_active` | boolean |

### 5.4 Row Level Security (RLS)
- Aktifkan RLS di semua tabel, policy dasar: `user_id = auth.uid()` untuk select/insert/update/delete
- Kategori & provider default (global) bisa dibuat `user_id IS NULL` dan readable oleh semua user, tapi user tetap bisa bikin kategori/provider custom milik sendiri

---

## 6. Fitur per Halaman

### 6.1 Beranda
- Kartu ringkasan besar: Total saldo / net (income − expense) periode berjalan
- Toggle periode: Hari ini / Minggu ini / Bulan ini / Custom range
- Chart utama: bar/line chart tren income vs expense
- Chart sekunder: pie/donut breakdown per kategori
- List transaksi terbaru (mini preview, 3-5 item terakhir) dengan link "lihat semua" ke Log Aktivitas

### 6.2 Log Aktivitas
- List transaksi dikelompokkan per tanggal (header "Hari ini", "Kemarin", "Senin, 22 Sep 2026", dst — mirip Dana/GoPay)
- Setiap item: ikon kategori, title, provider, nominal (warna hijau untuk income, merah/putih untuk expense)
- Filter: kategori, provider, tipe (expense/income), rentang tanggal
- Search bar (cari berdasarkan title/deskripsi)
- Tap item → detail transaksi (bisa edit/hapus)
- Infinite scroll atau pagination untuk performa

### 6.3 Statistik (tab kanan-luar, opsi rekomendasi)
- Perbandingan bulan-ke-bulan (bar chart)
- Top 5 kategori pengeluaran terbesar
- Rata-rata pengeluaran harian
- Heatmap kalender (opsional, seperti GitHub contribution graph tapi untuk pengeluaran)

### 6.4 Pengaturan
- Switch tema: Dark Green (default) ↔ Slate/Putih
- Kelola kategori (tambah/edit/hapus, pilih ikon & warna)
- Kelola provider/metode pembayaran
- Kelola API key OpenRouter (jika ingin bisa ganti-ganti) & pilihan model AI
- Export data (CSV, opsional untuk v2)
- Profil & logout (Supabase Auth)

---

## 7. Integrasi OpenRouter — Catatan Teknis

- Endpoint: `https://openrouter.ai/api/v1/chat/completions` (kompatibel format OpenAI SDK)
- Simpan API key di **environment variable server-side** (`OPENROUTER_API_KEY`), jangan pernah expose ke client — semua request AI harus lewat Next.js server action / API route, bukan langsung dari browser
- Model gratis yang bisa dicoba (cek ketersediaan & rate limit terbaru di halaman OpenRouter, karena daftar model gratis bisa berubah): `z-ai/glm-5.2:free`, atau model `:free` lain yang tersedia saat itu
- Siapkan daftar 2-3 model fallback karena model gratis kadang unstable/rate-limited
- Gunakan `response_format: { type: "json_object" }` jika model mendukung, untuk memastikan output selalu JSON valid
- Set `max_tokens` kecil (transaksi cuma butuh output singkat) untuk hemat kuota & lebih cepat

---

## 8. Skema Warna (Style Reference)

**Tema Dark (default) — terinspirasi Supabase/Vercel:**
- Background utama: `#0a0a0a` – `#111111` (hampir hitam, bukan abu gelap biasa)
- Aksen hijau: `#3ECF8E` (khas Supabase) atau `#00E599`
- Card/surface: `#1c1c1c` – `#1f1f1f` dengan border tipis `#2a2a2a`
- Text utama: `#fafafa`, text secondary: `#a1a1aa`

**Tema Terang/Slate:**
- Background: `#f8fafc` (slate-50)
- Aksen tetap hijau (konsisten brand) atau bisa switch ke aksen slate/hitam
- Card: putih dengan border `#e2e8f0`

Implementasi: pakai CSS variables (shadcn sudah support `next-themes` out of the box) supaya switch tema tidak perlu reload.

---

## 9. Rencana Deploy (0 Rupiah)

1. Push project ke GitHub (repo private/public)
2. Buat project Supabase gratis → jalankan migration SQL untuk tabel di atas → aktifkan RLS
3. Connect repo ke Vercel → set environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `OPENROUTER_API_KEY`, dll)
4. Deploy → dapat domain gratis `*.vercel.app`
5. (Opsional) Setup PWA manifest supaya bisa di-"install" ke home screen HP

---

## 10. Roadmap Bertahap

**v0.1 (MVP):**
- Auth Supabase (email/password atau magic link)
- Input AI → simpan transaksi (dengan preview konfirmasi)
- Log Aktivitas (list per hari)
- Beranda dasar (total & chart sederhana)

**v0.2:**
- Filter & search di Log Aktivitas
- Pengaturan tema + kelola kategori/provider
- Tab kanan-luar (Statistik direkomendasikan)

**v0.3+:**
- Budget/anggaran per kategori
- Multi-wallet/saldo per provider
- Export data, PWA install, voice input

---

## 11. Hal yang Masih Perlu Diputuskan

- [ ] Nama final aplikasi & branding
- [ ] Isi tab kanan-luar (Statistik / Dompet / Budget — lihat rekomendasi bagian 3)
- [ ] Apakah butuh multi-currency, atau IDR saja
- [ ] Apakah perlu voice-to-text untuk input (selain teks)
- [ ] Model AI utama + daftar fallback (final, ambil dari daftar model gratis OpenRouter terkini)