# Instalasi

## Requirements

- **Node.js** v20 atau lebih baru
- **npm** v10+
- **MySQL** / **PostgreSQL** (sesuaikan `.env`)

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
# App
TZ=Asia/Jakarta
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=                        # Generate dengan: node ace generate:key
NODE_ENV=production

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_db_password
DB_DATABASE=qris_dinamis

# Session
SESSION_DRIVER=cookie
```

> **Catatan:** Jalankan `node ace generate:key` untuk mendapatkan nilai `APP_KEY`.

### 4. Jalankan Migrasi Database

```bash
node ace migration:run
```

### 5. Menjalankan Aplikasi

#### Development (dengan hot-reload)

```bash
node ace serve --watch
```

Aplikasi akan berjalan di `http://localhost:3333`.

#### Production Build

```bash
npm run build
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
