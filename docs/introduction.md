# Qatch — Pengenalan

## Apa itu Qatch?

**Qatch** adalah platform yang memungkinkan kamu mengubah QRIS statis menjadi Qatch secara programatik. Dengan QRIS statis biasa, pembayar harus memasukkan nominal sendiri, sehingga sulit dicocokkan secara otomatis. Qatch mengatasi hal ini dengan meng-_embed_ nominal langsung ke dalam kode QRIS yang di-generate, lalu mencocokkan pembayaran masuk secara otomatis melalui notifikasi Android.

Platform ini dibangun di atas **AdonisJS 6** (backend) dan **Vue 3 + Inertia** (frontend), dan dapat diintegrasikan ke sistem e-commerce atau aplikasi apapun melalui REST API.

---

## Fitur Utama

| Fitur                | Deskripsi                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Nominal Otomatis** | QRIS yang di-generate sudah memuat nominal yang harus dibayar, tidak perlu input manual oleh pembayar                                                                                            |
| **Kode Unik**        | Setiap transaksi mendapat kode unik (3 digit) sebagai suffix nominal, memudahkan pencocokan mutasi                                                                                               |
| **API Key**          | Otentikasi berbasis API Key untuk keamanan akses endpoint                                                                                                                                        |
| **Webhook**          | Notifikasi otomatis ke URL tujuanmu saat transaksi berhasil dibayar                                                                                                                              |
| **Android Listener** | Memanfaatkan [Android Notification Forwarder](https://github.com/karuhun-developer/android-notification-forwarder) untuk menangkap notifikasi pembayaran dari aplikasi mobile banking / e-wallet |
| **HMAC Signature**   | Verifikasi keaslian payload webhook menggunakan HMAC-SHA256                                                                                                                                      |
| **Multi QRIS**       | Kelola beberapa QRIS statis dalam satu akun                                                                                                                                                      |

---

## Cara Kerja

```
[Merchant App]
     │
     │ POST /api/v1/dynamic-qris
     │ { qrisId, amount, feeType, expiredHours }
     ▼
[Qatch Server]
     │ Generate QRIS string dinamis + kode unik
     │ Simpan transaksi status: pending
     ▼
[QR Code] ──── Ditampilkan ke pembayar
     │
     │ Pembayar scan & bayar via m-banking/e-wallet
     ▼
[Notifikasi Masuk di HP Android Merchant]
     │
     │ Android Notification Forwarder forward ke:
     │ POST /api/v1/dynamic-qris/callback
     ▼
[Qatch Server]
     │ Cocokkan nominal di teks notifikasi
     │   dengan `total` transaksi pending
     │ Jika cocok → status: paid
     ▼
[Webhook ke Target URL]
     POST https://your-app.com/webhook
     { event: "transaction.paid", data: {...} }
```

### Penjelasan Singkat

1. **Generate Qatch** — Kirim request ke API dengan nominal yang diinginkan. Server akan men-generate QRIS string berisi nominal + kode unik.
2. **Tampilkan ke Pembayar** — Tampilkan QR Code dari `qrisString` yang diterima. Pembayar scan dan bayar seperti biasa.
3. **Android Forwarder Mendeteksi Pembayaran** — Saat notifikasi masuk di HP Android merchant (dari m-banking atau e-wallet), Android Notification Forwarder mengirim notifikasi tersebut ke endpoint `/callback`.
4. **Auto-Match & Mark Paid** — Server mencocokkan nominal di teks notifikasi dengan transaksi yang pending. Jika cocok, transaksi otomatis ditandai `paid`.
5. **Webhook Dikirim** — Server mengirim notifikasi ke URL webhook yang kamu daftarkan beserta data transaksi lengkap.
