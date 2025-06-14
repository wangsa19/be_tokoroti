const db = require("../models");
const Cart = db.Cart;
const CartItem = db.CartItem;
const Product = db.Product;

// Menemukan atau membuat keranjang untuk user
const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
        cart = await Cart.create({ userId });
    }
    return cart;
};

// GET /cart - Melihat isi keranjang
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            where: { userId: req.userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'imageUrl']
                }]
            }],
            order: [[{ model: CartItem, as: 'items' }, 'createdAt', 'ASC']]
        });

        if (!cart) {
            return res.status(200).send({ items: [], totalAmount: 0 });
        }

        // Hitung total harga
        let totalAmount = 0;
        if (cart.items) {
            totalAmount = cart.items.reduce((total, item) => {
                return total + (item.quantity * parseFloat(item.product.price));
            }, 0);
        }

        res.status(200).send({ ...cart.toJSON(), totalAmount });
    } catch (error) {
        res.status(500).send({ message: "Error saat mengambil data keranjang: " + error.message });
    }
};

// POST /cart - Menambah item ke keranjang
exports.addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    if (!productId || !quantity || quantity < 1) {
        return res.status(400).send({ message: "ID Produk dan kuantitas dibutuhkan." });
    }

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).send({ message: "Produk tidak ditemukan." });
        }

        const cart = await getOrCreateCart(userId);

        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId: productId }
        });

        if (cartItem) {
            // Jika item sudah ada, tambahkan quantity
            cartItem.quantity += parseInt(quantity, 10);
            await cartItem.save();
        } else {
            // Jika item belum ada, buat baru
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId: productId,
                quantity: parseInt(quantity, 10)
            });
        }

        res.status(201).send({ message: "Item berhasil ditambahkan ke keranjang.", data: cartItem });
    } catch (error) {
        res.status(500).send({ message: "Error saat menambah item: " + error.message });
    }
};

// PUT /cart/:cartItemId - Mengubah jumlah item
exports.updateCartItem = async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).send({ message: "Kuantitas harus berupa angka lebih besar dari 0." });
    }

    try {
        const cart = await getOrCreateCart(req.userId);
        const cartItem = await CartItem.findByPk(cartItemId);

        if (!cartItem || cartItem.cartId !== cart.id) {
            return res.status(404).send({ message: "Item keranjang tidak ditemukan atau bukan milik Anda." });
        }

        cartItem.quantity = parseInt(quantity, 10);
        await cartItem.save();

        res.status(200).send({ message: "Kuantitas item berhasil diperbarui.", data: cartItem });
    } catch (error) {
        res.status(500).send({ message: "Error saat memperbarui item: " + error.message });
    }
};

// DELETE /cart/:cartItemId - Menghapus item dari keranjang
exports.removeCartItem = async (req, res) => {
    const { cartItemId } = req.params;

    try {
        const cart = await getOrCreateCart(req.userId);
        const cartItem = await CartItem.findByPk(cartItemId);

        if (!cartItem || cartItem.cartId !== cart.id) {
            return res.status(404).send({ message: "Item keranjang tidak ditemukan atau bukan milik Anda." });
        }

        await cartItem.destroy();

        res.status(200).send({ message: "Item berhasil dihapus dari keranjang." });
    } catch (error) {
        res.status(500).send({ message: "Error saat menghapus item: " + error.message });
    }
};