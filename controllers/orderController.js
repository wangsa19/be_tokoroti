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
      status: 'paid'
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