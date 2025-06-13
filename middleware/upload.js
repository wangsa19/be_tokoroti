const multer = require('multer');

// Strategi penyimpanan: simpan file di memori sebagai Buffer.
// Ini adalah cara terbaik untuk integrasi dengan Cloudinary agar tidak perlu menyimpan file sementara di disk.
const storage = multer.memoryStorage();

// Filter untuk memastikan hanya file gambar yang diterima.
const fileFilter = (req, file, cb) => {
    // Periksa tipe MIME file, harus diawali dengan 'image/'
    if (file.mimetype.startsWith('image/')) {
        // Terima file jika itu adalah gambar
        cb(null, true);
    } else {
        // Tolak file jika bukan gambar, kirim pesan error
        cb(new Error('File yang diunggah bukan gambar!'), false);
    }
};

// Konfigurasi Multer dengan storage dan filter yang sudah dibuat.
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Batas ukuran file 5MB (opsional, tapi sangat disarankan)
    }
});

// Ekspor middleware yang sudah dikonfigurasi agar bisa digunakan di file rute.
module.exports = upload;