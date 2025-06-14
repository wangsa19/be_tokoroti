const snap = require('../config/midtrans');
const db = require('../models');
const { Order, OrderItem, Product, User } = db;

exports.createOrder = async (req, res) => {
  // `req.userId` didapat dari middleware authJwt
  const userId = req.userId; 
  // items adalah array of { productId, quantity }
  const { items, deliveryAddress, deliveryLatitude, deliveryLongitude } = req.body;

  const transaction = await db.sequelize.transaction();

  try {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found.`);
      }
      const pricePerItem = product.price;
      totalAmount += pricePerItem * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        pricePerItem: pricePerItem,
      });
    }

    const order = await Order.create({
      UserId: userId,
      totalAmount,
      deliveryAddress,
      deliveryLatitude,
      deliveryLongitude,
      status: 'unpaid'
    }, { transaction });

    for (const itemData of orderItemsData) {
      await OrderItem.create({
        OrderId: order.id,
        ...itemData
      }, { transaction });
    }

    await transaction.commit();
    res.status(201).send({ message: "Order created successfully!", orderId: order.id });

  } catch (error) {
    await transaction.rollback();
    res.status(500).send({ message: error.message || "Failed to create order." });
  }
};
exports.createPayment = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findByPk(orderId, {
            include: [
                { model: User, attributes: ['name', 'email'] },
                { model: OrderItem, include: [{ model: Product }] }
            ]
        });

        if (!order) {
            return res.status(404).send({ message: 'Order not found.' });
        }

        const transactionId = `TR-ROTI-${order.id}-${Date.now()}`;

        const parameter = {
            transaction_details: {
                order_id: transactionId,
                gross_amount: parseFloat(order.totalAmount),
            },
            customer_details: {
                first_name: order.User.name,
                email: order.User.email,
            },
            item_details: order.OrderItems
                .filter(item => item.Product)
                .map(item => ({
                    id: item.Product.id,
                    price: parseFloat(item.pricePerItem),
                    quantity: item.quantity,
                    name: item.Product.name
                }))
        };

        const transaction = await snap.createTransaction(parameter);
        const snapUrl = transaction.redirect_url;

        await order.update({
            transactionId: transactionId,
            snapUrl: snapUrl
        });

        res.status(200).send({ snapUrl });

    } catch (error) {
        console.error("Payment Creation Error:", error);
        res.status(500).send({ message: error.message });
    }
};

exports.handlePaymentNotification = async (req, res) => {
    try {
        const notificationJson = req.body;

        // Cukup teruskan body notifikasi JSON ke fungsi ini.
        // Library akan menangani verifikasi signature key secara otomatis.
        const statusResponse = await snap.transaction.notification(notificationJson);

        const order_id = statusResponse.order_id;
        const transaction_status = statusResponse.transaction_status;
        const fraud_status = statusResponse.fraud_status;

        console.log(`Transaction notification received. Order ID: ${order_id}. Transaction status: ${transaction_status}. Fraud status: ${fraud_status}`);

        const order = await Order.findOne({ where: { transactionId: order_id } });
        if (!order) {
            // Beri respon 200 OK agar Midtrans tidak mengirim notifikasi berulang.
            return res.status(200).send("Order not found, but notification acknowledged.");
        }

        // Logika update status pesanan (sudah benar)
        if (transaction_status == 'capture' || transaction_status == 'settlement') {
            if (fraud_status == 'accept') {
                await order.update({ status: 'paid' });
            }
        } else if (transaction_status == 'deny' || transaction_status == 'cancel' || transaction_status == 'expire') {
            await order.update({ status: 'failed' });
        }

        res.status(200).send("Notification received successfully.");

    } catch (error) {
        // Jika signature key tidak cocok atau ada error lain, akan masuk ke sini.
        console.error("Payment Notification Error:", error);
        res.status(500).send({ message: error.message });
    }
};
// --- Admin Section ---
exports.getAllTransactions = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { 
                    model: OrderItem,
                    include: [{ model: Product, attributes: ['name'] }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: 'customer' },
            attributes: ['id', 'name', 'email', 'createdAt']
        });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.userId; // ID pengguna didapat dari token JWT

    const orders = await Order.findAll({
      where: { UserId: userId },
      include: [ // Sertakan detail item di setiap pesanan
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['name', 'imageUrl'] }]
        }
      ],
      order: [['createdAt', 'DESC']] // Urutkan dari yang terbaru
    });

    res.status(200).send(orders);
  } catch (error) {
    console.error("Error fetching order history:", error); // Tambahkan log ini untuk debug
    res.status(500).send({ message: error.message || "Gagal mendapatkan riwayat pesanan." });
  }
};

// --- PASTIKAN FUNGSI INI SUDAH ADA DI BAGIAN AKHIR FILE ---
exports.completeOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findByPk(orderId);

    if (!order) {
      // Jika order tidak ditemukan, backend akan kirim error 404
      return res.status(404).send({ message: "Order tidak ditemukan." });
    }

    // Ubah status order menjadi 'paid'
    await order.update({ status: 'paid' });

    res.status(200).send({ message: "Pesanan telah berhasil diselesaikan." });

  } catch (error) {
    // Jika ada error database, backend akan kirim error 500
    res.status(500).send({ message: error.message || "Gagal menyelesaikan pesanan." });
  }
};