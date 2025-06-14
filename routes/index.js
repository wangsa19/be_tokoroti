const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController'); 
const {authJwt} = require('../middleware');
const upload = require('../middleware/upload');

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// --- Product Routes (Public) ---
router.get('/products', productController.getAllProducts);

// --- Order Routes (Customer) ---
// --- Cart Routes (Customer - Membutuhkan Login) ---
router.get('/cart', [authJwt.verifyToken], cartController.getCart); // Rute untuk MELIHAT isi keranjang
router.post('/cart', [authJwt.verifyToken], cartController.addItemToCart); // Rute untuk MENAMBAH item ke keranjang
router.put('/cart/:cartItemId', [authJwt.verifyToken], cartController.updateCartItem); // Rute untuk MENGUBAH jumlah item
router.delete('/cart/:cartItemId', [authJwt.verifyToken], cartController.removeCartItem); // Rute untuk MENGHAPUS item dari keranjang

// router.post('/orders', [authJwt.verifyToken], orderController.createOrder);
router.post('/orders', [authJwt.verifyToken], orderController.createOrder); // Rute membuat pesanan
router.post('/orders/:orderId/create-payment', [authJwt.verifyToken], orderController.createPayment); // Rute BARU untuk bayar

router.post('/payment-notification', orderController.handlePaymentNotification); // Rute BARU untuk notifikasi

// --- Admin Routes ---
router.post('/products', [authJwt.verifyToken, authJwt.isAdmin, upload.single('productImage')], productController.createProduct);

// Melihat semua transaksi (hanya admin)
router.get('/admin/transactions', [authJwt.verifyToken, authJwt.isAdmin], orderController.getAllTransactions);

// Melihat semua pelanggan (hanya admin)
router.get('/admin/users', [authJwt.verifyToken, authJwt.isAdmin], orderController.getAllCustomers);

router.post('/orders/:orderId/complete', [authJwt.verifyToken], orderController.completeOrder);
router.post('/payment-notification', orderController.handlePaymentNotification);

// --- RUTE BARU UNTUK RIWAYAT PESANAN PENGGUNA ---
router.get('/orders/my-history', [authJwt.verifyToken], orderController.getOrderHistory);

module.exports = router;