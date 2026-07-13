# Static QRIS API

Endpoint ini digunakan untuk mengelola data QRIS statis milikmu — upload, edit, lihat, dan hapus QRIS.

**Base URL:** `https://qris.karuhundeveloper.com`  
**Auth:** Semua endpoint memerlukan header `x-api-key`.

---

## Ringkasan Endpoint

| Method | Endpoint                  | Deskripsi               |
| ------ | ------------------------- | ----------------------- |
| GET    | `/api/v1/static-qris`     | List semua QRIS statis  |
| POST   | `/api/v1/static-qris`     | Tambah QRIS statis baru |
| GET    | `/api/v1/static-qris/:id` | Detail satu QRIS        |
| PUT    | `/api/v1/static-qris/:id` | Update QRIS             |
| DELETE | `/api/v1/static-qris/:id` | Hapus QRIS              |

---

## GET /api/v1/static-qris

Mengambil daftar semua QRIS statis milik pengguna yang terautentikasi, dengan paginasi.

### Headers

```
x-api-key: YOUR_API_KEY
```

### Query Parameters

| Parameter | Tipe    | Default | Deskripsi                |
| --------- | ------- | ------- | ------------------------ |
| `page`    | integer | 1       | Halaman yang ditampilkan |
| `limit`   | integer | 10      | Jumlah item per halaman  |

### Contoh Request

```bash
curl -X GET "https://qris.karuhundeveloper.com/api/v1/static-qris?page=1&limit=10" \
  -H "x-api-key: qd_live_abc123xyz456"
```

### Contoh Response

```json
{
  "message": "Success fetch static QRIS",
  "data": {
    "meta": {
      "total": 2,
      "perPage": 10,
      "currentPage": 1,
      "lastPage": 1
    },
    "data": [
      {
        "id": 1,
        "userId": 3,
        "name": "QRIS Toko Utama",
        "description": "QRIS untuk kasir utama",
        "qris": "uploads/qris/abc123.png",
        "qrisString": "00020101021226580014ID.CO.BNI.WWW01189360050300000000000202150000000000000000303UME51440014ID.CO.QRIS.WWW0215ID20231234567890303UME5204581253033605802ID5920TOKO KARUHUN JAYA6013BANDUNG BARAT610540376304XXXX",
        "createdAt": "2025-07-10T08:00:00.000Z",
        "updatedAt": "2025-07-10T08:00:00.000Z"
      }
    ]
  }
}
```

---

## POST /api/v1/static-qris

Menambahkan QRIS statis baru. Request dikirim sebagai `multipart/form-data` karena menyertakan file gambar QRIS.

### Headers

```
x-api-key: YOUR_API_KEY
Content-Type: multipart/form-data
```

### Request Body

| Field         | Tipe   | Wajib | Keterangan                                      |
| ------------- | ------ | ----- | ----------------------------------------------- |
| `name`        | string | ✅    | Nama QRIS (min. 3 karakter)                     |
| `description` | string | ❌    | Deskripsi opsional                              |
| `qris`        | file   | ✅    | File gambar QRIS (jpg/png/jpeg/webp, max 5MB)   |
| `qrisString`  | string | ✅    | String QRIS hasil scan/parse (min. 10 karakter) |

### Contoh Request

```bash
curl -X POST https://qris.karuhundeveloper.com/api/v1/static-qris \
  -H "x-api-key: qd_live_abc123xyz456" \
  -F "name=QRIS Toko Utama" \
  -F "description=QRIS untuk kasir utama" \
  -F "qris=@/path/to/qris.png" \
  -F "qrisString=00020101021226580014ID.CO.BNI..."
```

### Contoh Response

```json
{
  "message": "Static QRIS created successfully",
  "data": {
    "id": 1,
    "userId": 3,
    "name": "QRIS Toko Utama",
    "description": "QRIS untuk kasir utama",
    "qris": "uploads/qris/random32chars.png",
    "qrisString": "00020101021226580014ID.CO.BNI...",
    "createdAt": "2025-07-10T08:00:00.000Z",
    "updatedAt": "2025-07-10T08:00:00.000Z"
  }
}
```

---

## GET /api/v1/static-qris/:id

Mengambil detail satu QRIS statis berdasarkan ID.

### Headers

```
x-api-key: YOUR_API_KEY
```

### Contoh Request

```bash
curl -X GET https://qris.karuhundeveloper.com/api/v1/static-qris/1 \
  -H "x-api-key: qd_live_abc123xyz456"
```

### Contoh Response

```json
{
  "message": "Success get static QRIS",
  "data": {
    "id": 1,
    "userId": 3,
    "name": "QRIS Toko Utama",
    "description": "QRIS untuk kasir utama",
    "qris": "uploads/qris/random32chars.png",
    "qrisString": "00020101021226580014ID.CO.BNI...",
    "createdAt": "2025-07-10T08:00:00.000Z",
    "updatedAt": "2025-07-10T08:00:00.000Z"
  }
}
```

### Response jika tidak ditemukan

```json
{
  "message": "Static QRIS not found"
}
```

---

## PUT /api/v1/static-qris/:id

Memperbarui data QRIS statis. Semua field bersifat opsional — hanya kirim field yang ingin diubah.

### Headers

```
x-api-key: YOUR_API_KEY
Content-Type: multipart/form-data
```

### Request Body

| Field         | Tipe   | Wajib | Keterangan                                         |
| ------------- | ------ | ----- | -------------------------------------------------- |
| `name`        | string | ❌    | Nama baru (min. 3 karakter)                        |
| `description` | string | ❌    | Deskripsi baru                                     |
| `qris`        | file   | ❌    | File gambar QRIS baru (jpg/png/jpeg/webp, max 5MB) |
| `qrisString`  | string | ❌    | String QRIS baru (min. 10 karakter)                |

### Contoh Request

```bash
curl -X PUT https://qris.karuhundeveloper.com/api/v1/static-qris/1 \
  -H "x-api-key: qd_live_abc123xyz456" \
  -F "name=QRIS Toko Diperbarui" \
  -F "description=Deskripsi baru"
```

### Contoh Response

```json
{
  "message": "Static QRIS updated successfully",
  "data": {
    "id": 1,
    "userId": 3,
    "name": "QRIS Toko Diperbarui",
    "description": "Deskripsi baru",
    "qris": "uploads/qris/random32chars.png",
    "qrisString": "00020101021226580014ID.CO.BNI...",
    "createdAt": "2025-07-10T08:00:00.000Z",
    "updatedAt": "2025-07-13T10:30:00.000Z"
  }
}
```

---

## DELETE /api/v1/static-qris/:id

Menghapus QRIS statis berdasarkan ID.

### Headers

```
x-api-key: YOUR_API_KEY
```

### Contoh Request

```bash
curl -X DELETE https://qris.karuhundeveloper.com/api/v1/static-qris/1 \
  -H "x-api-key: qd_live_abc123xyz456"
```

### Contoh Response

```json
{
  "message": "Static QRIS deleted successfully"
}
```

### Response jika tidak ditemukan

```json
{
  "message": "Static QRIS not found"
}
```
