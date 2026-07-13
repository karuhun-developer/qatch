# Qatch - Project Overview & Agent Guidelines

## 1. Project Overview

**Qatch** adalah sebuah platform berbasis web yang memungkinkan pengguna (UMKM, Developer, Freelancer) untuk mengubah QRIS Statis biasa menjadi **Qatch**.
Fungsi utamanya adalah menambahkan **nominal pembayaran yang terkunci** dan **kode unik** ke dalam string QRIS, sehingga pengguna tidak perlu memasukkan nominal secara manual. Platform ini juga dilengkapi dengan integrasi **Webhook** dan **Android Notification Forwarder** untuk memverifikasi pembayaran secara otomatis.

## 2. Tech Stack

- **Backend Framework**: [AdonisJS v6](https://docs.adonisjs.com/) (TypeScript)
- **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API) + [InertiaJS](https://inertiajs.com/)
- **UI & Styling**: [TailwindCSS](https://tailwindcss.com/) + [Shadcn Vue](https://www.shadcn-vue.com/)
- **ORM / Database**: AdonisJS Lucid (Agnostic - currently compatible with SQLite & MySQL)
- **Authentication**: AdonisJS Auth (Session-based for Web) + API Keys (for Webhook/API endpoints)
- **Utilities**:
  - `luxon` untuk manajemen tanggal dan waktu.
  - `node-cron` untuk task penjadwalan (scheduler).
  - `jsqr` dan `qrcode.vue` untuk ekstraksi & render QRIS di frontend.

## 3. Core Features

- **Manajemen QRIS Statis**: Upload dan ekstrak payload QRIS statis dari gambar.
- **Generator Qatch**: Membuat QRIS sekali pakai dengan nominal + kode unik, plus fitur penambahan fee (fixed/percent).
- **Webhook & Android Listener**: Pengguna bisa menyambungkan aplikasi Android Forwarder untuk menangkap notifikasi e-wallet dan me-trigger webhook yang memvalidasi `status` transaksi menjadi `paid`.
- **User & Plan Management**: Sistem subscription/paket (Free, Pro, Enterprise) yang membatasi pembuatan QRIS Statis dan limit transaksi bulanan per akun. Limit transaksi di-reset otomatis setiap tanggal 1 lewat `start/scheduler.ts`.
- **Live Demo**: Halaman interaktif (frontend-only logic) yang mengizinkan simulasi pembuatan Qatch tanpa login atau akses database.

## 4. Architecture & Coding Style Guidelines

### A. Backend (AdonisJS 6)

- **Controllers** (`app/controllers/`):
  Hanya bertugas menerima request, memvalidasi input via Validator (`app/validators`), memanggil Service, dan mereturn response (JSON atau Inertia render).
  _Rule:_ **Dilarang keras** memasukkan _heavy business logic_ (perhitungan saldo, manipulasi QR string, limit checker) ke dalam Controller.
- **Services** (`app/services/`):
  Gunakan Service Classes untuk segala jenis _business logic_. Gunakan _Dependency Injection_ (`@inject()`) pada Controller untuk menggunakan Service.
- **Models & ORM** (`app/models/`):
  Gunakan penamaan standar Lucid (camelCase untuk properti TypeScript, snake_case untuk tabel database). Selalu gunakan query yang _Database Agnostic_ (Hindari raw string functions seperti `DATE('now')` milik SQLite jika memungkinkan, gunakan `luxon` sebagai gantinya).
- **Scheduler**: Berada di `start/scheduler.ts` (diload lewat `adonisrc.ts` pada environment tertentu).

### B. Frontend (Vue 3 + Inertia + Tailwind)

- **Pages** (`inertia/pages/`): Komponen utama yang di-render oleh Inertia.
- **Components** (`inertia/components/`): Komponen _reusable_.
- **Shadcn Vue** (`inertia/components/ui/`): Komponen dasar form/UI. Jika butuh komponen baru, install via `npx shadcn-vue@latest add [nama-komponen]`.
- **Styling**:
  Sangat ditekankan menggunakan **Modern Aesthetics** dengan gaya **Bento Style** (Bento Grid) untuk menyusun komponen dan layout konten. Gunakan border radius modern, layout grid yang rapi seperti bento box, dan transisi/efek animasi (`transition-all hover:scale-105`). Jangan menggunakan styling _bland/generic_.

## 5. Security & Authorization

- **Superadmin (Role ID: 1)** vs **User (Role ID: 2)**. Pastikan pengecekan otorisasi data (seperti melihat/menghapus QRIS) difilter berdasarkan `auth.user.id` jika login sebagai User.
- Pengguna mendaftarkan akun di `/register` dengan wajib memilih tipe `plan_id`. Middleware Authentication akan meload relasi Plan milik User secara eager agar bisa ditampilkan di UI/Inertia props.

---

**Catatan untuk AI/Agent berikutnya:** Jika Anda membaca file ini, selalu rujuk pola arsitektur di atas sebelum membuat fitur baru. Pastikan _UI/UX_ selalu terlihat premium dan _business logic_ tetap rapi berada di `app/services/`.
