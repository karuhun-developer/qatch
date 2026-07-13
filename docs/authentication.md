# Autentikasi

Semua endpoint API di QRIS Dinamis memerlukan autentikasi menggunakan **API Key**. Selain itu, payload webhook yang dikirim ke server kamu dapat diverifikasi menggunakan **HMAC Signature**.

---

## API Key

### Cara Generate API Key

1. Login ke dashboard QRIS Dinamis
2. Buka menu **Pengaturan Webhook & API**
3. Klik tombol **Generate API Key**
4. Salin API Key yang muncul — simpan baik-baik, tidak bisa dilihat lagi setelah ditutup

### Cara Menggunakan API Key

Sertakan API Key di setiap request pada header `x-api-key`:

```
x-api-key: YOUR_API_KEY
```

#### Contoh dengan cURL

```bash
curl -X GET https://qris.karuhundeveloper.com/api/v1/static-qris \
  -H "x-api-key: qd_live_abc123xyz456def789"
```

---

## HMAC Signature (Verifikasi Webhook)

HMAC Signature bersifat **opsional** namun sangat direkomendasikan untuk memastikan bahwa request webhook yang diterima benar-benar berasal dari server QRIS Dinamis.

### Cara Kerja

Saat transaksi berhasil dibayar, server QRIS Dinamis akan mengirim POST request ke URL webhook kamu. Jika kamu telah mengatur **HMAC Key** di pengaturan, server akan menyertakan header `x-signature-key` yang berisi HMAC-SHA256 dari body request.

### Cara Mengatur HMAC Key

1. Login ke dashboard → **Pengaturan Webhook & API**
2. Isi field **HMAC Key** dengan string rahasia pilihanmu
3. Simpan pengaturan

### Format Signature

```
x-signature-key: <hex_string_hasil_hmac_sha256>
```

Signature dihitung dari **raw request body** (JSON string) menggunakan algoritma HMAC-SHA256 dengan HMAC Key sebagai secret.

### Verifikasi Signature di Sisi Penerima

#### Node.js

```javascript
const crypto = require('crypto')

function verifyWebhookSignature(rawBody, receivedSignature, hmacKey) {
  const expectedSignature = crypto.createHmac('sha256', hmacKey).update(rawBody).digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(receivedSignature, 'hex')
  )
}

// Contoh penggunaan di Express.js
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-signature-key']
  const hmacKey = process.env.QRIS_HMAC_KEY

  if (!verifyWebhookSignature(req.body, signature, hmacKey)) {
    return res.status(401).json({ message: 'Invalid signature' })
  }

  const payload = JSON.parse(req.body)
  console.log('Event:', payload.event)
  console.log('Transaction:', payload.data)

  res.json({ received: true })
})
```

#### PHP

```php
function verifyWebhookSignature(string $rawBody, string $receivedSignature, string $hmacKey): bool
{
    $expectedSignature = hash_hmac('sha256', $rawBody, $hmacKey);
    return hash_equals($expectedSignature, $receivedSignature);
}

// Contoh penggunaan di Laravel
public function handleWebhook(Request $request)
{
    $rawBody = $request->getContent();
    $signature = $request->header('x-signature-key');
    $hmacKey = env('QRIS_HMAC_KEY');

    if (!verifyWebhookSignature($rawBody, $signature, $hmacKey)) {
        return response()->json(['message' => 'Invalid signature'], 401);
    }

    $payload = json_decode($rawBody, true);
    // Handle payload...

    return response()->json(['received' => true]);
}
```

---

## Ringkasan Header

| Header            | Wajib         | Keterangan                                                             |
| ----------------- | ------------- | ---------------------------------------------------------------------- |
| `x-api-key`       | ✅ Ya         | Untuk otentikasi semua request API                                     |
| `x-signature-key` | ⚠️ Opsional   | Dikirim server pada payload webhook, untuk verifikasi di sisi penerima |
| `Content-Type`    | ✅ (POST/PUT) | `application/json` untuk body JSON                                     |
