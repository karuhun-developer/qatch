<div align="center">
  <h1>⚡ Qatch</h1>
  <p><strong>Konversi Static QRIS menjadi Dynamic QRIS dengan verifikasi pembayaran secara real-time & zero payment gateway fees.</strong></p>
  <br/>
  <img alt="AdonisJS" src="https://img.shields.io/badge/AdonisJS-5E0DAC?style=for-the-badge&logo=adonisjs&logoColor=white"/>
  <img alt="Vue.js" src="https://img.shields.io/badge/Vue.js-42B883?style=for-the-badge&logo=vuedotjs&logoColor=white"/>
  <img alt="Inertia.js" src="https://img.shields.io/badge/Inertia.js-7C3AED?style=for-the-badge&logo=inertia&logoColor=white"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
</div>

---

## 💡 Konsep

Normalnya, Static QRIS mengharuskan _customer_ input nominal secara manual, dan _merchant_ harus cek mutasi via aplikasi m-banking/e-wallet untuk memastikan dana masuk. **Qatch** solve masalah ini:

1. Mem-parsing _string_ Static QRIS dan inject nominal transaksi untuk generate Dynamic QR Code.
2. Menggunakan [Android Notification Forwarder](https://github.com/karuhun-developer/android-notification-forwarder) untuk intercept _incoming payment notification_ di HP merchant.
3. Mem-forward data notifikasi via HTTP POST ke endpoint webhook sistem ini.
4. Melakukan auto-verification pada payload dan update status transaksi menjadi `PAID`.

## 🚀 Fitur Utama

| Fitur                         | Deskripsi                                                                  |
| ----------------------------- | -------------------------------------------------------------------------- |
| 🔁 **Dynamic QRIS Generator** | Otomatis append nominal + kode unik ke base payload Static QRIS            |
| 📡 **Real-time Webhook**      | Endpoint siap menerima POST request dari Android Notification Forwarder    |
| 🤖 **Auto Verification**      | Parsing teks notifikasi untuk mencocokkan nominal & update status otomatis |
| 🔑 **API Key & HMAC**         | Autentikasi aman untuk semua akses API                                     |
| 🛡️ **Webhook Filtering**      | Wildcard filter berdasarkan nama app, judul & isi notifikasi               |
| 📊 **Analytics Dashboard**    | Chart penggunaan harian, statistik, dan log transaksi terbaru              |
| 👥 **Multi-user & Roles**     | Manajemen user dengan role Superadmin dan User biasa                       |
| 💳 **Subscription System**    | Manajemen paket berlangganan berbayar dan gratis, serta batasan limit      |
| ⚡ **Paywuz Integration**     | Pembayaran otomatis dengan Paywuz API (Virtual Account & QRIS)             |
| 💰 **Zero PG Fees**           | 100% self-hosted untuk proses Dynamic QRIS (kecuali langganan platform)    |

## ⚙️ Cara Kerja

```
Customer scan QR
      │
      ▼
[Qatch] Generate QR dengan nominal spesifik + kode unik
      │         misal: Rp 50.000 → Rp 50.021 (021 = kode unik harian)
      │
      ▼
Customer bayar via e-wallet / m-banking
      │
      ▼
Push notification masuk ke HP merchant
("Dana masuk: Rp 50.021 dari QRIS")
      │
      ▼
[Android Notification Forwarder] intercept & forward ke webhook
      │
      ▼
[Qatch] validasi nominal → status PENDING → PAID ✅
```

## 🗺️ API Endpoints

Semua endpoint membutuhkan header `x-api-key` untuk autentikasi.

### Static QRIS

| Method   | Endpoint                  | Deskripsi                           |
| -------- | ------------------------- | ----------------------------------- |
| `GET`    | `/api/v1/static-qris`     | Daftar semua QRIS statis (paginasi) |
| `POST`   | `/api/v1/static-qris`     | Tambah QRIS statis baru             |
| `GET`    | `/api/v1/static-qris/:id` | Detail QRIS statis                  |
| `PUT`    | `/api/v1/static-qris/:id` | Update QRIS statis                  |
| `DELETE` | `/api/v1/static-qris/:id` | Hapus QRIS statis                   |

### Dynamic QRIS

| Method | Endpoint                        | Deskripsi                               |
| ------ | ------------------------------- | --------------------------------------- |
| `POST` | `/api/v1/dynamic-qris`          | Generate Qatch baru                     |
| `GET`  | `/api/v1/dynamic-qris/:id`      | Cek status transaksi                    |
| `PUT`  | `/api/v1/dynamic-qris/:id`      | Update status manual                    |
| `POST` | `/api/v1/dynamic-qris/callback` | **Webhook** untuk notifikasi pembayaran |

### Webhook Callback Payload

```json
POST /api/v1/dynamic-qris/callback
x-api-key: YOUR_API_KEY

{
  "app_name": "Dana",
  "notification_title": "Dana Masuk",
  "notification_text": "Kamu menerima Rp 50.021 dari QRIS",
  "timestamp_ms": 1720432800000
}
```

## 🔧 Tech Stack

- **[AdonisJS v7](https://adonisjs.com/)** — Backend framework (API, Webhook, Auth, Cron Jobs)
- **[Inertia.js](https://inertiajs.com/) + [Vue.js 3](https://vuejs.org/)** — Full-stack SPA tanpa REST overhead
- **[shadcn/vue](https://www.shadcn-vue.com/)** — UI Component library
- **[Chart.js](https://www.chartjs.org/)** — Visualisasi data dashboard
- **[Android Notification Forwarder](https://github.com/karuhun-developer/android-notification-forwarder)** — Notification interceptor di sisi Android
- **[Paywuz SDK](https://www.npmjs.com/package/paywuz-sdk)** — Sistem pembayaran berlangganan platform

## 🛠️ Instalasi

### Prerequisites

- Node.js >= 20
- NPM atau Yarn
- Database (SQLite untuk development, PostgreSQL/MySQL untuk production)

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/karuhun-developer/qris-dinamis.git
cd qris-dinamis

# 2. Install dependencies
npm install

# 3. Copy file environment
cp .env.example .env

# 4. Generate app key
node ace generate:key

# 5. Jalankan migrasi database
node ace migration:run

# 6. (Opsional) Jalankan seeder
node ace db:seed

# 7. Start development server
npm run dev
```

## ⚙️ Konfigurasi Webhook

1. Install **Android Notification Forwarder** di HP merchant.
2. Login ke dashboard Qatch → menu **Webhook & API**.
3. Copy **URL Webhook** yang tersedia.
4. Paste URL tersebut ke konfigurasi Android Notification Forwarder.
5. Atur **Listen Apps** (contoh: `Dana, Gopay, Shopeepay`) dan **Wildcard** filter sesuai kebutuhan.
6. Setiap ada notifikasi pembayaran masuk, status transaksi akan otomatis ter-update.

## 📁 Struktur Project

```
├── app/
│   ├── controllers/
│   │   ├── api/v1/          # API Controllers (Static & Dynamic QRIS)
│   │   └── ...              # Web Controllers (Dashboard, Auth, dll)
│   ├── middleware/
│   │   └── api_key_middleware.ts  # Autentikasi via x-api-key
│   ├── models/              # Lucid ORM Models
│   └── services/            # Business logic (QRIS parsing, generation)
├── database/
│   └── migrations/          # Database schema migrations
├── inertia/
│   ├── pages/               # Vue.js pages (Dashboard, QRIS, Webhook, dll)
│   ├── components/          # Reusable Vue components
│   └── layouts/             # Layout templates
└── start/
    ├── routes.ts            # Route definitions
    └── kernel.ts            # Middleware registration
```

## 🙌 Inspired By

Project ini terinspirasi dari [verssache/qris-dinamis](https://github.com/verssache/qris-dinamis).

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/karuhun-developer">Karuhun Developer</a></p>
</div>
