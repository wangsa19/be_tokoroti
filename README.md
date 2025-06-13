# API Backend Toko Roti

Ini adalah backend API untuk aplikasi toko roti modern yang dibangun menggunakan Node.js, Express.js, dan PostgreSQL. API ini menangani semua logika bisnis mulai dari otentikasi pengguna, manajemen produk, pemesanan, hingga integrasi pembayaran online.

## Fitur Utama

  - ✅ **Otentikasi Pengguna:** Sistem registrasi dan login yang aman menggunakan JWT (JSON Web Tokens).
  - ✅ **Manajemen Produk:** Admin dapat menambah produk baru beserta gambar.
  - ✅ **Sistem Pemesanan:** Pelanggan dapat membuat pesanan yang berisi beberapa produk.
  - ✅ **Unggah Gambar:** Terintegrasi dengan Cloudinary untuk menangani unggahan dan penyimpanan gambar produk.
  - ✅ **Integrasi Pembayaran:** Terhubung dengan Midtrans menggunakan metode Snap Redirect untuk berbagai pilihan pembayaran.
  - ✅ **Notifikasi Pembayaran:** Webhook untuk menerima notifikasi status pembayaran secara real-time dari Midtrans.
  - ✅ **Fitur Admin:** Endpoint khusus untuk admin melihat semua data transaksi dan pelanggan.

## Teknologi yang Digunakan

  - **Backend:** Node.js, Express.js
  - **Database:** PostgreSQL
  - **ORM:** Sequelize
  - **Otentikasi:** `jsonwebtoken`, `bcryptjs`
  - **Unggah File:** `multer`
  - **Penyimpanan Gambar:** Cloudinary
  - **Gateway Pembayaran:** Midtrans (`midtrans-client`)
  - **Manajemen Environment:** `dotenv`

## Prasyarat

Sebelum memulai, pastikan Anda sudah menginstal perangkat lunak berikut di komputer Anda:

  - [Node.js](https://nodejs.org/) (disarankan versi LTS)
  - [npm](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)
  - [PostgreSQL](https://www.postgresql.org/download/)
  - Akun [Cloudinary](https://cloudinary.com/users/register/free) (untuk API Key)
  - Akun [Midtrans Sandbox](https://www.google.com/search?q=https://sandbox.midtrans.com/) (untuk API Key)

## Instalasi & Konfigurasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

1.  **Clone Repository**

    ```bash
    git clone https://github.com/wangsa19/be_tokoroti.git
    cd toko-roti-backend
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Setup Database**

      - Buka pgAdmin atau `psql`.
      - Buat database baru, misalnya dengan nama `tokoroti_db`.

4.  **Konfigurasi Environment Variables**

      - Salin file `.env.example` (jika ada) atau buat file baru bernama `.env` di root folder proyek.
      - Isi file `.env` dengan kredensial Anda. Lihat bagian **Contoh File .env** di bawah.

5.  **Sinkronisasi Database**

      - Untuk pertama kali, Anda bisa mengatur `force: true` sementara di `server.js` untuk membuat semua tabel.
      - Jalankan server sekali, lalu kembalikan ke `force: false` atau `alter: true`.

## Menjalankan Aplikasi

1.  **Jalankan Server Development**

    ```bash
    node server.js
    ```

    Atau, tambahkan skrip di `package.json` untuk kemudahan:

    ```json
    "scripts": {
      "start": "node server.js"
    }
    ```

    atau (syarat install nodemon)

    ```json
    "scripts": {
      "start": "nodemon server.js"
    }
    ```

    Lalu jalankan dengan:

    ```bash
    npm start
    ```

2.  Server akan berjalan di `http://localhost:8080` (atau port yang Anda tentukan di `.env`).

## Dokumentasi API Endpoint

### Otentikasi

| Metode | Endpoint             | Deskripsi                   | Keamanan |
| :----- | :------------------- | :-------------------------- | :------- |
| `POST` | `/api/auth/register` | Mendaftarkan pengguna baru  | Publik   |
| `POST` | `/api/auth/login`    | Login dan mendapatkan token | Publik   |

### Produk

| Metode | Endpoint        | Deskripsi                       | Keamanan         |
| :----- | :-------------- | :------------------------------ | :--------------- |
| `GET`  | `/api/products` | Mendapatkan semua produk        | Publik           |
| `POST` | `/api/products` | Menambahkan produk baru (gambar)| **Hanya Admin** |

### Pesanan & Pembayaran

| Metode | Endpoint                                | Deskripsi                                | Keamanan            |
| :----- | :-------------------------------------- | :--------------------------------------- | :------------------ |
| `POST` | `/api/orders`                           | Membuat pesanan baru (status `unpaid`) | Perlu Login (User)  |
| `POST` | `/api/orders/:orderId/create-payment`   | Membuat link pembayaran Midtrans (Snap)  | Perlu Login (User)  |
| `POST` | `/api/payment-notification`             | Menerima notifikasi dari Midtrans        | Publik (Webhook)    |

### Admin

| Metode | Endpoint                 | Deskripsi                   | Keamanan      |
| :----- | :----------------------- | :-------------------------- | :------------ |
| `GET`  | `/api/admin/transactions`| Mendapatkan semua transaksi | **Hanya Admin** |
| `GET`  | `/api/admin/users`       | Mendapatkan semua pelanggan | **Hanya Admin** |

## Contoh File `.env`

Buat file `.env` dan isi dengan format seperti di bawah ini.

```env
# Konfigurasi Server
NODE_ENV=development
PORT=8080

# Konfigurasi Database PostgreSQL
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password_database_anda
DB_NAME=tokoroti_db
DB_DIALECT=postgres

# Konfigurasi JWT
JWT_SECRET=ini-adalah-kunci-rahasia-yang-sangat-panjang

# Konfigurasi Cloudinary
CLOUDINARY_CLOUD_NAME=nama_cloud_cloudinary_anda
CLOUDINARY_API_KEY=api_key_cloudinary_anda
CLOUDINARY_API_SECRET=api_secret_cloudinary_anda

# Konfigurasi Midtrans Sandbox
MIDTRANS_SERVER_KEY=SB-Mid-server-kunci_server_midtrans_anda
MIDTRANS_CLIENT_KEY=SB-Mid-client-kunci_client_midtrans_anda
```