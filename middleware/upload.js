const multer = require('multer');

// Strategi penyimpanan: simpan file di memori sebagai Buffer.
const storage = multer.memoryStorage();

// Filter untuk memastikan hanya file gambar yang diterima.
const fileFilter = (req, file, cb) => {
    // Tipe MIME yang diizinkan
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        // Terima file jika tipe MIME-nya ada dalam daftar yang diizinkan
        cb(null, true);
    } else {
        // Tolak file jika bukan gambar, kirim pesan error yang lebih spesifik
        cb(new Error('Tipe file tidak didukung! Hanya .png, .jpg, .jpeg, .gif yang diizinkan.'), false);
    }
};

// Konfigurasi Multer dengan storage dan filter yang sudah dibuat.
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Batas ukuran file 5MB
    }
});

// Ekspor middleware yang sudah dikonfigurasi.
module.exports = upload;