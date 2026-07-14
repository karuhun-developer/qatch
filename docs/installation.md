# Instalasi

## Requirements

- **Node.js** v24 atau lebih baru
- **npm** v11+
- **MySQL** / **Sqlite** (sesuaikan `.env`)

---

## Langkah Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/karuhun-developer/qris-dinamis.git
cd qris-dinamis
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
```

Buka file `.env` dan isi variabel berikut:

```env
# Node
TZ=Asia/Jakarta
PORT=3333
HOST=localhost
NODE_ENV=development

# Buka https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app untuk mendapatkan Client ID dan Client Secret GitHub Anda.
GITHUB_CLIENT_ID=               # Isi dengan Client ID GitHub Anda
GITHUB_CLIENT_SECRET=           # Isi dengan Client Secret GitHub Anda

# Buka https://console.cloud.google.com/apis/credentials untuk mendapatkan Client ID dan Client Secret Google Anda.
GOOGLE_CLIENT_ID=               # Isi dengan Client ID Google Anda
GOOGLE_CLIENT_SECRET=           # Isi dengan Client Secret Google Anda

# App
LOG_LEVEL=warning
APP_KEY=                        # Generate dengan: node ace generate:key
APP_URL=https://example.com     # Isi dengan URL aplikasi Anda

# Session
SESSION_DRIVER=cookie

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=qrisdinamis
```

> **Catatan:** Jalankan `node ace generate:key` untuk mendapatkan nilai `APP_KEY`.

### 4. Jalankan Migrasi Database

```bash
node ace migration:run
```

### 5. Menjalankan Aplikasi

#### Development (dengan hot-reload)

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3333`.

#### Production Build

```bash
npm run build
npm ci --omit="dev"
node bin/server.js
```

---

## Setup Systemd Service (Linux Production)

File `qris-dinamis.service` sudah tersedia di root project. Salin ke direktori systemd:

```bash
sudo cp qris-dinamis.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable qris-dinamis
sudo systemctl start qris-dinamis
```

Cek status service:

```bash
sudo systemctl status qris-dinamis
```

Lihat log:

```bash
sudo journalctl -u qris-dinamis -f
```

> Pastikan path di dalam `qris-dinamis.service` sudah disesuaikan dengan lokasi project dan user yang tepat sebelum mengaktifkan service.
