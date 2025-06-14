const sequelize = require('../config/database');

const db = {};

db.Sequelize = require('sequelize');
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize);
db.Product = require('./product')(sequelize);
db.Order = require('./order')(sequelize);
db.OrderItem = require('./orderItem')(sequelize);
db.Cart = require('./cart.js')(sequelize);
db.CartItem = require('./cartItem.js')(sequelize);

// Define relationships
// User -> Order (One-to-Many)
db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);

// Order -> OrderItem (One-to-Many)
db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);

// Product -> OrderItem (One-to-Many)
db.Product.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Product, {
  foreignKey: 'ProductId',
  onDelete: 'RESTRICT'
});

// User -> Cart (One-to-One)
// Setiap pengguna memiliki satu keranjang.
db.User.hasOne(db.Cart, { foreignKey: 'userId', onDelete: 'CASCADE' }); // Jika user dihapus, cart juga.
db.Cart.belongsTo(db.User, { foreignKey: 'userId' });

// Cart -> CartItem (One-to-Many)
// Setiap keranjang bisa memiliki banyak item.
db.Cart.hasMany(db.CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' }); // Jika cart dihapus, isinya juga.
db.CartItem.belongsTo(db.Cart, { foreignKey: 'cartId' });

// Product -> CartItem (One-to-Many)
// Satu produk bisa ada di banyak item keranjang.
db.Product.hasMany(db.CartItem, { foreignKey: 'productId' });
db.CartItem.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });

module.exports = db;