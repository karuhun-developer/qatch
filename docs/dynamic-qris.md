# Dynamic QRIS API

Endpoint ini digunakan untuk men-generate QRIS dinamis, mengecek status transaksi, mengupdate status secara manual, serta menerima callback dari Android Notification Forwarder.

**Base URL:** `https://qris.karuhundeveloper.com`  
**Auth:** Semua endpoint memerlukan header `x-api-key`.

---

## Ringkasan Endpoint

| Method | Endpoint                        | Deskripsi                       |
| ------ | ------------------------------- | ------------------------------- |
| POST   | `/api/v1/dynamic-qris`          | Generate QRIS dinamis baru      |
| GET    | `/api/v1/dynamic-qris/:id`      | Cek status transaksi            |
| PUT    | `/api/v1/dynamic-qris/:id`      | Update status transaksi manual  |
| POST   | `/api/v1/dynamic-qris/callback` | Callback dari Android Forwarder |

---

## POST /api/v1/dynamic-qris

Men-generate QRIS dinamis berdasarkan QRIS statis yang sudah terdaftar. Server akan membuat `qrisString` baru dengan nominal yang sudah di-_embed_ beserta kode unik.

### Headers

```
x-api-key: YOUR_API_KEY
Content-Type: application/json
```

### Request Body

| Field          | Tipe    | Wajib | Keterangan                                                  |
| -------------- | ------- | ----- | ----------------------------------------------------------- |
| `qrisId`       | integer | ✅    | ID QRIS statis yang akan digunakan sebagai dasar            |
| `amount`       | integer | ✅    | Nominal transaksi dalam rupiah (min. 1)                     |
| `feeType`      | string  | ✅    | Tipe biaya: `none`, `fixed`, atau `percent`                 |
| `feeValue`     | number  | ✅    | Nilai biaya (min. 0). Jika `feeType=none`, isi `0`          |
| `expiredHours` | integer | ❌    | Durasi kadaluarsa dalam jam (min. 1, max. 720). Default: 24 |

#### Penjelasan `feeType`

| `feeType` | `feeValue` | Keterangan               |
| --------- | ---------- | ------------------------ |
| `none`    | `0`        | Tidak ada biaya tambahan |
| `fixed`   | `2000`     | Biaya tetap Rp 2.000     |
| `percent` | `2.5`      | Biaya 2.5% dari `amount` |

### Contoh Request

```bash
curl -X POST https://qris.karuhundeveloper.com/api/v1/dynamic-qris \
  -H "x-api-key: qd_live_abc123xyz456" \
  -H "Content-Type: application/json" \
  -d '{
    "qrisId": 1,
    "amount": 50000,
    "feeType": "fixed",
    "feeValue": 2000,
    "expiredHours": 1
  }'
```

### Contoh Response

```json
{
  "message": "Dynamic QRIS generated successfully",
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
    "qrisString": "00020101021226580014ID.CO.BNI.WWW...5204581253033605802ID5920TOKO KARUHUN JAYA...6304ABCD",
    "status": "pending",
    "proof": null,
    "paidAt": null,
    "expiredAt": "2025-07-13T10:00:00.000Z",
    "createdAt": "2025-07-13T09:00:00.000Z",
    "updatedAt": "2025-07-13T09:00:00.000Z"
  }
}
```

> **Catatan:** Field `total` = `amount` + `feeAmount` + `uniqueCode`. Ini adalah nominal **yang sebenarnya muncul di notifikasi pembayaran** dan digunakan untuk auto-matching.

---

## GET /api/v1/dynamic-qris/:id

Mengambil detail dan status terkini sebuah transaksi QRIS dinamis.

### Headers

```
x-api-key: YOUR_API_KEY
```

### Contoh Request

```bash
curl -X GET https://qris.karuhundeveloper.com/api/v1/dynamic-qris/42 \
  -H "x-api-key: qd_live_abc123xyz456"
```

### Contoh Response

```json
{
  "message": "Success get dynamic QRIS",
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
    "qrisString": "00020101021226580014ID.CO.BNI.WWW...",
    "status": "paid",
    "proof": null,
    "paidAt": "2025-07-13T09:15:43.000Z",
    "expiredAt": "2025-07-13T10:00:00.000Z",
    "createdAt": "2025-07-13T09:00:00.000Z",
    "updatedAt": "2025-07-13T09:15:43.000Z"
  }
}
```

#### Status Transaksi

| Status    | Keterangan          |
| --------- | ------------------- |
| `pending` | Menunggu pembayaran |
| `paid`    | Sudah dibayar       |
| `expired` | Kadaluarsa          |

---

## PUT /api/v1/dynamic-qris/:id

Update status transaksi secara manual. Berguna untuk menandai pembayaran yang masuk namun tidak terdeteksi otomatis, atau untuk membatalkan/mereset transaksi.

Jika status diubah ke `paid` dan disertai file bukti, server juga akan memicu webhook ke URL tujuanmu.

### Headers

```
x-api-key: YOUR_API_KEY
Content-Type: multipart/form-data
```

### Request Body

| Field    | Tipe   | Wajib | Keterangan                                                                  |
| -------- | ------ | ----- | --------------------------------------------------------------------------- |
| `status` | string | ✅    | Status baru: `pending`, `paid`, atau `expired`                              |
| `proof`  | file   | ❌    | Bukti pembayaran (jpg/png/jpeg, max 5MB). Hanya diproses jika `status=paid` |

### Contoh Request — Tandai Paid dengan Bukti

```bash
curl -X PUT https://qris.karuhundeveloper.com/api/v1/dynamic-qris/42 \
  -H "x-api-key: qd_live_abc123xyz456" \
  -F "status=paid" \
  -F "proof=@/path/to/bukti.jpg"
```

### Contoh Request — Tandai Expired

```bash
curl -X PUT https://qris.karuhundeveloper.com/api/v1/dynamic-qris/42 \
  -H "x-api-key: qd_live_abc123xyz456" \
  -H "Content-Type: application/json" \
  -d '{"status": "expired"}'
```

### Contoh Response

```json
{
  "message": "Dynamic QRIS status updated successfully",
  "data": {
    "id": 42,
    "transactionCode": "TRX-20250713-XYZ789",
    "amount": 50000,
    "total": 52021,
    "status": "paid",
    "proof": "uploads/proofs/abcdef123456.jpg",
    "paidAt": "2025-07-13T09:30:00.000Z",
    "expiredAt": "2025-07-13T10:00:00.000Z",
    "createdAt": "2025-07-13T09:00:00.000Z",
    "updatedAt": "2025-07-13T09:30:00.000Z"
  }
}
```

---

## POST /api/v1/dynamic-qris/callback

Endpoint ini dipanggil oleh **Android Notification Forwarder** setiap kali ada notifikasi baru di HP Android merchant. Server akan memfilter notifikasi berdasarkan pengaturan webhook (listenApps, titleWildcards, textWildcards), lalu mencocokkan nominal di teks notifikasi dengan transaksi pending yang aktif.

> **Penting:** Endpoint ini tetap memerlukan `x-api-key` yang valid.

### Headers

```
x-api-key: YOUR_API_KEY
Content-Type: application/json
```

### Request Body

| Field                | Tipe    | Wajib | Keterangan                                                                |
| -------------------- | ------- | ----- | ------------------------------------------------------------------------- |
| `app_name`           | string  | ❌    | Nama package aplikasi pengirim notifikasi (contoh: `com.bni.bniactivity`) |
| `notification_title` | string  | ❌    | Judul notifikasi                                                          |
| `notification_text`  | string  | ✅    | Isi teks notifikasi yang mengandung informasi pembayaran                  |
| `timestamp_ms`       | integer | ❌    | Timestamp notifikasi dalam millisecond                                    |

### Contoh Request (dari Android Forwarder)

```bash
curl -X POST https://qris.karuhundeveloper.com/api/v1/dynamic-qris/callback \
  -H "x-api-key: qd_live_abc123xyz456" \
  -H "Content-Type: application/json" \
  -d '{
    "app_name": "Dana",
    "notification_title": "Pembayaran Masuk",
    "notification_text": "Rp52.021 dari PT.BANK SEABANK INDONESIA berhasil diterima DANA Bisnis.",
    "timestamp_ms": 1752393600000
  }'
```

### Contoh Response — Transaksi Ditemukan

```json
{
  "message": "Callback processed successfully, transaction marked as paid",
  "data": {
    "id": 42,
    "transactionCode": "TRX-20250713-XYZ789",
    "amount": 50000,
    "total": 52021,
    "status": "paid",
    "paidAt": "2025-07-13T09:15:43.000Z",
    "expiredAt": "2025-07-13T10:00:00.000Z"
  }
}
```

### Contoh Response — Tidak Ada Transaksi yang Cocok

```json
{
  "message": "Callback processed, but no matching pending transaction found"
}
```

### Contoh Response — Diabaikan (Filter Tidak Lolos)

```json
{
  "message": "Ignored: App 'com.whatsapp' is not in listenApps"
}
```

### Logika Pencocokan

Server mengekstrak semua angka dari `notification_text` dan mencocokkannya dengan field `total` pada transaksi dengan status `pending` yang belum kadaluarsa. Karena `total` sudah unik (mengandung kode unik 3 digit), kemungkinan duplikasi sangat kecil.

**Contoh:** Teks `"Pembayaran Rp 52.021 diterima"` → angka yang diekstrak: `[52021]` → cocok dengan transaksi `total: 52021`.
