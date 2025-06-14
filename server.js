const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const db = require('./models');
const allRoutes = require('./routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synced.');
  initial(); // Uncomment untuk membuat data awal
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Selamat Datang di API Toko Roti.' });
});
app.use('/api', allRoutes);

// Jalankan server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


// Optional: Fungsi untuk data awal
async function initial() {
    // Membuat admin user jika belum ada
    const count = await db.User.count({where: {role: 'admin'}});
    if(count === 0) {
        db.User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: bcrypt.hashSync('admin123', 8),
            role: 'admin'
        });
    }
    // Menambahkan beberapa produk
    const productCount = await db.Product.count();
    if(productCount === 0) {
        db.Product.bulkCreate([
            {name: 'Roti Coklat', description: 'Roti empuk dengan isian coklat lumer', price: 5000, imageUrl: "https://res.cloudinary.com/dtqtfbtee/image/upload/v1749872749/WhatsApp_Image_2025-06-14_at_10.43.41_5aad473d_bnagqv.jpg"},
            {name: 'Donat Gula', description: 'Donat klasik dengan taburan gula halus', price: 3000, imageUrl: "https://res.cloudinary.com/dtqtfbtee/image/upload/v1749872554/WhatsApp_Image_2025-06-14_at_10.42.04_52b30b42_swjaxn.jpg"},
            {name: 'Roti Keju', description: 'Roti dengan topping keju cheddar', price: 6000, imageUrl: "https://res.cloudinary.com/dtqtfbtee/image/upload/v1749872499/WhatsApp_Image_2025-06-14_at_10.40.22_18ff6c37_hg4vde.jpg"}
        ]);
    }
}