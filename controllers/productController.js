const cloudinary = require('../config/cloudinary');
const db = require('../models');
const Product = db.Product;

exports.createProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ message: "Gambar produk wajib diisi dan harus berupa file gambar." });
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "toko_roti/products", 
        });

        const { name, description, price } = req.body;
        
        const product = await Product.create({
            name,
            description,
            price,
            imageUrl: result.secure_url 
        });
        
        res.status(201).send(product);

    } catch (error) {
        console.error("Error saat membuat produk:", error);
        res.status(500).send({ message: error.message || "Terjadi kesalahan pada server." });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};