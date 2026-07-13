# Webhook & Android Notification Forwarder

## Cara Kerja

```
[HP Android Merchant]
  Notifikasi masuk dari m-banking / e-wallet
        │
        ▼
[Android Notification Forwarder]
  Membaca notifikasi & forward ke server
        │
        │ POST /api/v1/dynamic-qris/callback
        │ { app_name, notification_title, notification_text, timestamp_ms }
        ▼
[QRIS Dinamis Server]
  1. Filter berdasarkan listenApps, titleWildcards, textWildcards
  2. Ekstrak semua angka dari notification_text
  3. Cocokkan dengan `total` transaksi pending milik user
  4. Jika cocok → mark as PAID
        │
        │ POST ke Target Webhook URL
        │ { event: "transaction.paid", data: {...} }
        │ Header: x-signature-key (HMAC-SHA256)
        ▼
[Aplikasimu]
  Terima payload & proses (update order, kirim notifikasi, dll)
```

---

## Setup Android Notification Forwarder

### Download & Install

1. Download APK dari: **[https://github.com/karuhun-developer/android-notification-forwarder/releases](https://github.com/karuhun-developer/android-notification-forwarder/releases)**
2. Install APK di HP Android yang akan digunakan sebagai listener pembayaran (HP yang menerima notifikasi m-banking/e-wallet)
3. Buka aplikasi dan berikan izin **Notification Access** yang diminta

### Konfigurasi di Aplikasi

Isi konfigurasi berikut di aplikasi Android Notification Forwarder:

| Field          | Contoh Nilai                                                     | Keterangan                                                   |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **Server URL** | `https://qris.karuhundeveloper.com/api/v1/dynamic-qris/callback` | Endpoint callback QRIS Dinamis                               |
| **Headers**    | `x-api-key: qd_live_abc123xyz456`                                | API Key dari dashboard (Wajib ditaruh di header `x-api-key`) |

Setelah dikonfigurasi, aplikasi akan otomatis mengirim setiap notifikasi yang masuk ke server QRIS Dinamis.

---

## Konfigurasi Webhook di Dashboard

Buka dashboard → **Pengaturan Webhook & API** untuk mengatur filter dan target webhook.

### Pengaturan yang Tersedia

#### `listenApps` — Filter Aplikasi

Daftar nama aplikasi yang notifikasinya akan diproses. Pisahkan dengan koma. Biarkan kosong untuk menerima dari semua aplikasi.

```
Dana, Gojek Merchant, Mandiri Livin
```

> **Tip:** Gunakan ini untuk hanya memproses notifikasi dari m-banking atau e-wallet tertentu, mengabaikan notifikasi WhatsApp, SMS, dll.

#### `titleWildcards` — Filter Judul Notifikasi

Kata kunci yang harus ada di judul notifikasi (OR logic — cukup satu yang cocok). Pisahkan dengan koma.

```
penerimaan dana, pembayaran diterima, qris
```

#### `textWildcards` — Filter Isi Notifikasi

Kata kunci yang harus ada di isi teks notifikasi (OR logic). Pisahkan dengan koma.

```
pembayaran, diterima, rp
```

#### `targetUrl` — URL Target Webhook

URL endpoint di aplikasimu yang akan menerima notifikasi saat transaksi berhasil dibayar.

```
https://your-app.com/webhook/qris
```

---

## Payload yang Dikirim ke Target Webhook URL

Saat transaksi berhasil ditandai `paid` (baik otomatis maupun manual), server akan mengirim POST request ke `targetUrl` dengan payload berikut:

### Headers

```
Content-Type: application/json
x-signature-key: <hmac_sha256_dari_body>
```

### Body

```json
{
  "event": "transaction.paid",
  "data": {
    "id": 42,
    "transactionCode": "TRX-20250713-XYZ789",
    "qrisId": 1,
    "userId": 3,
    "amount": 50000,
    "feeType": "fixed",
    "feeValue": 2000,
    "feeAmount": 2000,
    "uniqueCode": 21,
    "total": 52021,
    "qrisString": "00020101021226580014ID.CO.BNI...",
    "status": "paid",
    "proof": null,
    "paidAt": "2025-07-13T09:15:43.000Z",
    "expiredAt": "2025-07-13T10:00:00.000Z",
    "createdAt": "2025-07-13T09:00:00.000Z",
    "updatedAt": "2025-07-13T09:15:43.000Z"
  }
}
```

---

## Verifikasi Signature di Sisi Penerima

Header `x-signature-key` berisi HMAC-SHA256 dari raw request body menggunakan **HMAC Key** yang kamu atur di dashboard.

### Node.js (Express)

```javascript
const crypto = require('crypto')
const express = require('express')

const app = express()
const HMAC_KEY = process.env.QRIS_HMAC_KEY // Harus sama dengan yang di dashboard

// Penting: gunakan express.raw() agar body tidak diparsing lebih dulu
app.post('/webhook/qris', express.raw({ type: 'application/json' }), (req, res) => {
  const receivedSignature = req.headers['x-signature-key']

  // Verifikasi signature
  const expectedSignature = crypto.createHmac('sha256', HMAC_KEY).update(req.body).digest('hex')

  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature || '', 'hex')
  )

  if (!isValid) {
    return res.status(401).json({ message: 'Signature tidak valid' })
  }

  const payload = JSON.parse(req.body)

  if (payload.event === 'transaction.paid') {
    const transaction = payload.data
    console.log(`Transaksi ${transaction.transactionCode} berhasil dibayar`)
    console.log(`Nominal: Rp ${transaction.amount.toLocaleString('id-ID')}`)

    // Update status order di database, kirim notifikasi ke customer, dll.
  }

  res.json({ received: true })
})
```

### PHP (Laravel)

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class QrisWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $rawBody = $request->getContent();
        $receivedSignature = $request->header('x-signature-key');
        $hmacKey = env('QRIS_HMAC_KEY'); // Harus sama dengan yang di dashboard

        // Verifikasi signature
        $expectedSignature = hash_hmac('sha256', $rawBody, $hmacKey);

        if (!hash_equals($expectedSignature, $receivedSignature ?? '')) {
            return response()->json(['message' => 'Signature tidak valid'], 401);
        }

        $payload = json_decode($rawBody, true);

        if ($payload['event'] === 'transaction.paid') {
            $transaction = $payload['data'];

            // Update order, kirim email/notifikasi, dll.
            \Log::info("Transaksi dibayar: {$transaction['transactionCode']}");
            \Log::info("Nominal: Rp " . number_format($transaction['amount'], 0, ',', '.'));
        }

        return response()->json(['received' => true]);
    }
}
```

> **Catatan:** Jika HMAC Key tidak diatur di dashboard, header `x-signature-key` tidak akan disertakan dalam request webhook.
