API Backend Toko Roti

Ini adalah backend API untuk aplikasi toko roti modern yang dibangun menggunakan Node.js, Express.js, dan PostgreSQL. API ini menangani semua logika bisnis mulai dari otentikasi pengguna, manajemen produk, pemesanan, hingga integrasi pembayaran online.
Fitur Utama

    ✅ Otentikasi Pengguna: Sistem registrasi dan login yang aman menggunakan JWT (JSON Web Tokens).

    ✅ Manajemen Produk: Admin dapat menambah produk baru beserta gambar.

    ✅ Sistem Pemesanan: Pelanggan dapat membuat pesanan yang berisi beberapa produk.

    ✅ Unggah Gambar: Terintegrasi dengan Cloudinary untuk menangani unggahan dan penyimpanan gambar produk.

    ✅ Integrasi Pembayaran: Terhubung dengan Midtrans menggunakan metode Snap Redirect untuk berbagai pilihan pembayaran.

    ✅ Notifikasi Pembayaran: Webhook untuk menerima notifikasi status pembayaran secara real-time dari Midtrans.

    ✅ Fitur Admin: Endpoint khusus untuk admin melihat semua data transaksi dan pelanggan.

Teknologi yang Digunakan

    Backend: Node.js, Express.js

    Database: PostgreSQL

    ORM: Sequelize

    Otentikasi: jsonwebtoken, bcryptjs

    Unggah File: multer

    Penyimpanan Gambar: Cloudinary

    Gateway Pembayaran: Midtrans (midtrans-client)

    Manajemen Environment: dotenv

Prasyarat

Sebelum memulai, pastikan Anda sudah menginstal perangkat lunak berikut di komputer Anda:

    Node.js (disarankan versi LTS)

    npm (biasanya terinstal bersama Node.js)

    PostgreSQL

Instalasi & Konfigurasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

    Clone Repository

    git clone https://github.com/wangsa19/be_tokoroti.git
    cd toko-roti-backend

    Install Dependencies

    npm install

    Setup Database

        Buka pgAdmin atau psql.

        Buat database baru, misalnya dengan nama tokoroti_db.

    Konfigurasi Environment Variables

        Salin file .env.example (jika ada) atau buat file baru bernama .env di root folder proyek.

        Isi file .env dengan kredensial Anda. Lihat bagian Contoh File .env di bawah.

Setup Layanan Pihak Ketiga (Bagi yang Belum Punya Akun)

Sebelum bisa menjalankan semua fitur, Anda perlu mendaftar dan mengkonfigurasi tiga layanan eksternal: Cloudinary, Midtrans, dan Ngrok.
1. Pendaftaran Cloudinary (Penyimpanan Gambar)

Cloudinary digunakan untuk menyimpan gambar produk yang diunggah.

    Buat Akun: Kunjungi halaman pendaftaran Cloudinary dan buat akun gratis. Anda bisa mendaftar menggunakan Google, GitHub, atau email.

    Cari Kredensial: Setelah berhasil login, Anda akan diarahkan ke Dashboard. Cari informasi berikut di halaman utama:

        Cloud Name

        API Key

        API Secret

    Salin ke .env: Salin ketiga nilai tersebut ke dalam file .env Anda sesuai dengan variabel yang sudah disediakan.

    CLOUDINARY_CLOUD_NAME=nama_cloud_cloudinary_anda
    CLOUDINARY_API_KEY=api_key_cloudinary_anda
    CLOUDINARY_API_SECRET=api_secret_cloudinary_anda

2. Pendaftaran Midtrans Sandbox (Gateway Pembayaran)

Midtrans digunakan untuk memproses pembayaran. Selama pengembangan, kita akan menggunakan lingkungan Sandbox yang aman.

    Buat Akun Sandbox: Kunjungi halaman pendaftaran Midtrans Sandbox.

    Lengkapi Pendaftaran: Isi formulir dan ikuti proses verifikasi.

    Cari Access Keys: Setelah login, navigasi ke menu Settings > Access Keys.

    Salin ke .env: Anda akan menemukan Client Key dan Server Key. Salin keduanya ke file .env.

    MIDTRANS_SERVER_KEY=SB-Mid-server-kunci_server_midtrans_anda
    MIDTRANS_CLIENT_KEY=SB-Mid-client-kunci_client_midtrans_anda

3. Setup Ngrok (Webhook Tunneling)

Ngrok diperlukan untuk membuat tunnel dari server lokal Anda (localhost) ke internet. Ini wajib agar server Anda dapat menerima notifikasi status pembayaran (webhook) dari Midtrans.

    Buat Akun Ngrok: Kunjungi halaman pendaftaran Ngrok dan buat akun gratis untuk mendapatkan authtoken.

    Unduh Ngrok: Buka halaman unduh Ngrok dan unduh file yang sesuai untuk sistem operasi Anda (Windows/macOS/Linux).

    Hubungkan Akun Anda:

        Ekstrak file .zip yang telah diunduh.

        Buka dashboard Ngrok Anda dan pergi ke bagian "Your Authtoken".

        Salin perintah yang diberikan, contohnya: ngrok config add-authtoken <TOKEN_ANDA>.

        Jalankan perintah tersebut di terminal atau Command Prompt Anda. Ini hanya perlu dilakukan sekali.

    Jalankan Ngrok:

        Pertama, jalankan server backend Anda (misalnya npm start di port 8080).

        Buka terminal baru, lalu jalankan perintah berikut (ganti 8080 jika port Anda berbeda):

        ./ngrok http 8080

        Ngrok akan menampilkan beberapa informasi. Cari URL Forwarding yang berakhiran ngrok-free.app (contoh: https://random-string.ngrok-free.app).

    Konfigurasi Webhook Midtrans:

        Salin URL Forwarding dari Ngrok.

        Di dashboard Midtrans Sandbox, pergi ke Settings > Configuration.

        Tempelkan URL Ngrok Anda ke kolom Payment Notification URL, lalu tambahkan endpoint webhook Anda. Contoh: https://random-string.ngrok-free.app/api/payment-notification.

        Simpan konfigurasi. Sekarang server lokal Anda siap menerima notifikasi dari Midtrans.

Sinkronisasi Database

    Untuk pertama kali, Anda bisa mengatur force: true sementara di server.js untuk membuat semua tabel.

    Jalankan server sekali, lalu kembalikan ke force: false atau alter: true agar data tidak selalu hilang saat server dimulai ulang.

Menjalankan Aplikasi

    Jalankan Server Development

    node server.js

    Atau, tambahkan skrip di package.json untuk kemudahan:

    "scripts": {
      "start": "node server.js"
    }

    atau (jika sudah menginstal nodemon secara global/projek):

    "scripts": {
      "start": "nodemon server.js"
    }

    Lalu jalankan dengan:

    npm start

    Server akan berjalan di http://localhost:8080 (atau port yang Anda tentukan di .env).

Dokumentasi API Endpoint
Otentikasi

Metode
	

Endpoint
	

Deskripsi
	

Keamanan

POST
	

/api/auth/register
	

Mendaftarkan pengguna baru
	

Publik

POST
	

/api/auth/login
	

Login dan mendapatkan token
	

Publik
Produk

Metode
	

Endpoint
	

Deskripsi
	

Keamanan

GET
	

/api/products
	

Mendapatkan semua produk
	

Publik

POST
	

/api/products
	

Menambahkan produk baru (gambar)
	

Hanya Admin
Pesanan & Pembayaran

Metode
	

Endpoint
	

Deskripsi
	

Keamanan

POST
	

/api/orders
	

Membuat pesanan baru (status unpaid)
	

Perlu Login (User)

POST
	

/api/orders/:orderId/create-payment
	

Membuat link pembayaran Midtrans (Snap)
	

Perlu Login (User)

POST
	

/api/payment-notification
	

Menerima notifikasi dari Midtrans
	

Publik (Webhook)
Admin

Metode
	

Endpoint
	

Deskripsi
	

Keamanan

GET
	

/api/admin/transactions
	

Mendapatkan semua transaksi
	

Hanya Admin

GET
	

/api/admin/users
	

Mendapatkan semua pelanggan
	

Hanya Admin
Contoh File .env

Buat file .env dan isi dengan format seperti di bawah ini. Ganti nilai-nilai placeholder dengan kredensial asli Anda.

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
JWT_SECRET=ini-adalah-kunci-rahasia-yang-sangat-panjang-dan-aman

# Konfigurasi Cloudinary
CLOUDINARY_CLOUD_NAME=nama_cloud_cloudinary_anda
CLOUDINARY_API_KEY=api_key_cloudinary_anda
CLOUDINARY_API_SECRET=api_secret_cloudinary_anda

# Konfigurasi Midtrans Sandbox
MIDTRANS_SERVER_KEY=SB-Mid-server-kunci_server_midtrans_anda
MIDTRANS_CLIENT_KEY=SB-Mid-client-kunci_client_midtrans_anda
