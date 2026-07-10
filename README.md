# QRIS Dinamis

Ubah standard Static QRIS menjadi Dynamic QRIS dengan fitur verifikasi pembayaran secara _real-time_. Project ini adalah solusi _cost-effective_ untuk bypass potongan _payment gateway_ (PG), dengan memanfaatkan device Android untuk _intercept_ notifikasi mutasi/e-wallet dan mem-forward datanya ke webhook.

## 💡 Concept

Normalnya, Static QRIS mengharuskan _customer_ input nominal secara manual, dan _merchant_ harus ngecek mutasi via aplikasi m-banking/e-wallet untuk memastikan dana masuk. **QRIS Dinamis** men-_solve_ masalah ini dengan cara:

1. Mem-parsing _string_ Static QRIS dan _inject_ nominal transaksi untuk men-_generate_ Dynamic QR Code.
2. Menggunakan [Android Notification Forwarder](https://github.com/karuhun-developer/android-notification-forwarder) untuk _intercept_ _incoming payment notification_ di HP _merchant_.
3. Mem-forward data dari notifikasi tersebut via HTTP POST request ke _endpoint_ webhook sistem ini.
4. Melakukan _auto-verification_ pada _payload_ dan meng-update status transaksi menjadi `PAID`.

## 🚀 Key Features

- **Dynamic QRIS Generator:** Otomatis _append_ nominal transaksi ke _base payload_ Static QRIS.
- **Real-time Webhook:** _Endpoint_ yang _ready_ menerima POST request langsung dari Android Notification Forwarder.
- **Auto Verification:** Mem-parsing teks notifikasi untuk mencocokkan nominal transaksi dan langsung _update_ status di database.
- **Zero PG Fees:** 100% _self-hosted_ dan bebas biaya admin _payment gateway_.
- **Modern Dashboard:** UI dashboard yang _seamless_ untuk monitoring transaksi menggunakan Inertia.js dan Vue.

## ⚙️ How It Works

1. **Create Transaction:** Sistem men-_generate_ Dynamic QRIS untuk spesifik nominal dengan kode unik perhari diakhir (contoh: 50.021), 21 merupakan kode unik untuk membedakan transaksi yang sama nominalnya (misal: Rp 50.000) agar _merchant_ bisa mem-verifikasi pembayaran secara _real-time_.
2. **Customer Pays:** _Customer_ _scan_ QR dan bayar dengan nominal yang sudah _locked_.
3. **Incoming Notification:** Aplikasi m-banking / e-wallet _merchant_ menerima _push notification_ (misal: "Dana Masuk Rp 50.000").
4. **Intercept & Forward:** Android Notification Forwarder akan _catch_ notifikasi ini dan melakukan _push data_ ke webhook `QRIS Dinamis`.
5. **Status Update:** Logic di webhook akan mem-validasi teks/nominal dan otomatis mengubah status transaksi dari `PENDING` menjadi `PAID`.

## 🔧 Tech Stack

- **AdonisJS** - Node.js Framework (Backend & Webhook Processor)
- **Inertia.js & Vue.js** - Frontend Stack (Dashboard & Transaction Monitor)
- **[Android Notification Forwarder](https://github.com/karuhun-developer/android-notification-forwarder)** - Notification Interceptor
