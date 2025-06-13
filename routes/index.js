const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const {authJwt} = require('../middleware');
const upload = require('../middleware/upload');

// --- Auth Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// --- Product Routes (Public) ---
router.get('/products', productController.getAllProducts);

// --- Order Routes (Customer) ---
router.post('/orders', [authJwt.verifyToken], orderController.createOrder);

// --- Admin Routes ---
router.post('/products', [authJwt.verifyToken, authJwt.isAdmin, upload.single('productImage')], productController.createProduct);

// Melihat semua transaksi (hanya admin)
router.get('/admin/transactions', [authJwt.verifyToken, authJwt.isAdmin], orderController.getAllTransactions);

// Melihat semua pelanggan (hanya admin)
router.get('/admin/users', [authJwt.verifyToken, authJwt.isAdmin], orderController.getAllCustomers);

module.exports = router;